import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import { Form, Input, Button, Select, Card, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import { createEmployee, getEmployeeById, updateEmployee } from "@/services/satffservices";
import { Employee } from "@/types/employeetype";

const { Option } = Select;

type EmployeeFormData = Omit<Employee, "id">;

const FormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Lấy id từ URL
  const isEditMode = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        setLoading(true);
        try {
          const response = await getEmployeeById(id);
          if (response.success && response.data) {
            form.setFieldsValue(response.data); // Điền thông tin vào form
          } else {
            message.error(response.error || "Không thể tải dữ liệu nhân viên!");
          }
        } catch {
          message.error("Có lỗi xảy ra khi tải dữ liệu!");
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id, form]);

  const onFinish = async (values: EmployeeFormData) => {
    setLoading(true);
    try {
      if (isEditMode && id) {
        const response = await updateEmployee(id, values);
        if (response.success) {
          message.success("Cập nhật nhân viên thành công!");
          navigate("/staff"); // Chuyển hướng về trang danh sách
        } else {
          message.error(response.error || "Không thể cập nhật nhân viên!");
        }
      } else {
        const response = await createEmployee(values);
        if (response.success) {
          message.success("Tạo nhân viên thành công!");
          form.resetFields();
          navigate("/staff"); // Chuyển hướng về trang danh sách
        } else {
          message.error(response.error || "Không thể tạo nhân viên!");
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Card
        title={
          <h2 className="text-3xl font-bold text-center text-orange-500">
            {isEditMode ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
          </h2>
        }
        className="w-full max-w-5xl shadow-2xl rounded-2xl border border-gray-200"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
        >
          {isEditMode && (
            <Form.Item
              label={<span className="font-medium">Mã nhân viên</span>}
              name="code"
            >
              <Input
                prefix={<IdcardOutlined className="text-gray-400 text-lg" />}
                className="rounded-lg py-3 px-4 text-base bg-gray-100"
                disabled // Đảm bảo không thể chỉnh sửa code
              />
            </Form.Item>
          )}

          <Form.Item
            label={<span className="font-medium">Tên nhân viên</span>}
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400 text-lg" />}
              placeholder="Nhập tên nhân viên"
              className="rounded-lg py-3 px-4 text-base"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400 text-lg" />}
              placeholder="Nhập email"
              className="rounded-lg py-3 px-4 text-base"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Số điện thoại</span>}
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^\d{10,11}$/, message: "Số điện thoại không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400 text-lg" />}
              placeholder="Nhập số điện thoại"
              className="rounded-lg py-3 px-4 text-base"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Chức vụ</span>}
            name="position"
            rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
          >
            <Input
              placeholder="Nhập chức vụ"
              className="rounded-lg py-3 px-4 text-base"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Giới tính</span>}
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính" className="rounded-lg py-3 px-4 text-base">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Trạng thái</span>}
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái" className="rounded-lg py-3 px-4 text-base">
              <Option value="active">Hoạt động</Option>
              <Option value="deactive">Ngừng hoạt động</Option>
            </Select>
          </Form.Item>

          <div className="md:col-span-2 text-center pt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full max-w-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-lg py-3"
            >
              {isEditMode ? "Cập Nhật Nhân Viên" : "Tạo Nhân Viên"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default FormPage;
