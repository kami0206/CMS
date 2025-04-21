import React, { useState } from "react";
import { Form, Input, Button, Select, notification } from "antd";
import Api from "@/services/api";

const { Option } = Select;

interface EmployeeFormProps {
  onSuccess: () => void; // Callback khi tạo nhân viên thành công
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách nhân viên hiện tại
      const response = await Api.get("/staff");
      const allStaff = response.data;

      const conflicts = [];

      if (
        allStaff.some(
          (s: any) =>
            s.name === values.name &&
            (s.email === values.email || s.phone === values.phone)
        )
      ) {
        conflicts.push("tên");
      }
      if (allStaff.some((s: any) => s.email === values.email)) {
        conflicts.push("email");
      }
      if (allStaff.some((s: any) => s.phone === values.phone)) {
        conflicts.push("số điện thoại");
      }

      if (conflicts.length > 0) {
        notification.error({
          message: "Trùng thông tin",
          description: `Các trường sau đã tồn tại: ${conflicts.join(", ")}`,
        });
        setLoading(false);
        return;
      }

      // Nếu không trùng -> gửi API tạo mới
      await Api.post("/staff", values);
      notification.success({
        message: "Thành công",
        description: "Nhân viên mới đã được tạo!",
      });
      onSuccess();
    } catch (error) {
      console.error("Lỗi tạo nhân viên:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi tạo nhân viên. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      initialValues={{
        role: "Employee",
        gender: "male",
        status: "active",
      }}
    >
      <Form.Item
        label="Tên nhân viên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
      >
        <Input placeholder="Nhập tên nhân viên" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại!" },
          {
            pattern: /^[0-9]{9,}$/,
            message: "Số điện thoại phải có ít nhất 9 chữ số!",
          },
        ]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Chức vụ"
        name="role"
        rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
      >
        <Select placeholder="Chọn chức vụ">
          <Option value="Manager">Quản lý</Option>
          <Option value="Employee">Nhân viên</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Giới tính"
        name="gender"
        rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
      >
        <Select placeholder="Chọn giới tính">
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
          <Option value="other">Khác</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
      >
        <Select placeholder="Chọn trạng thái">
          <Option value="active">Hoạt động</Option>
          <Option value="inactive">Ngừng hoạt động</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tạo mới
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
