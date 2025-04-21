import React, { useState } from "react";
import { Form, Input, Button, notification, Select } from "antd";
import Api from "@/services/api";

interface EmployeeFormProps {
    initialValues: any;
    onSuccess: (values: any) => Promise<void>; // Chỉnh sửa kiểu ở đây
  }
  
  const EmployeeEditForm: React.FC<EmployeeFormProps> = ({ initialValues, onSuccess }) => {
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (values: any) => {
      setLoading(true);
      try {
        // Gọi API cập nhật thông tin nhân viên
        await Api.put(`/staff/${initialValues.id}`, values);
        await onSuccess(values); // Gọi onSuccess sau khi cập nhật thành công
        notification.success({
          message: "Thành công",
          description: "Thông tin nhân viên đã được cập nhật!",
        });
      } catch {
        notification.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra khi cập nhật thông tin nhân viên. Vui lòng thử lại!",
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
        <Form
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item label="Tên nhân viên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}>
          <Input />
        </Form.Item>
  
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
          <Input />
        </Form.Item>
  
        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
          <Input />
        </Form.Item>
  
        <Form.Item label="Chức vụ" name="role" rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}>
          <Select placeholder="Chọn chức vụ">
            <Select.Option value="Manager">Quản lý</Select.Option>
            <Select.Option value="Employee">Nhân viên</Select.Option>
          </Select>
        </Form.Item>
  
        <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
          <Select placeholder="Chọn giới tính">
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </Form.Item>
  
        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Ngừng</Select.Option>
          </Select>
        </Form.Item>
  
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default EmployeeEditForm;
  