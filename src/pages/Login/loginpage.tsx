import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/userstore';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUserData } = useAuthStore();

  interface LoginFormValues {
    email: string;
    password: string;
    remember?: boolean;
  }

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    const success = await fetchUserData(values.email, values.password);
    setLoading(false);

    if (success) {
      message.success("Đăng nhập thành công!");
      navigate("/");
    } else {
      message.error("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Chào mừng trở lại </h2>
        <Form
          name="login"
          initialValues={{
            remember: true,
            email: 'vuvansu390@gmail.com',
            password: 'su123456'
          }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label={<span className="font-medium">Email</span>}
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập email"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="font-medium">Mật khẩu</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu"
              className="py-2"
            />
          </Form.Item>

          <div className="flex items-center justify-between mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-sm">Ghi nhớ tài khoản</Checkbox>
            </Form.Item>
            <a href="#" className="text-sm text-blue-500 hover:underline">Quên mật khẩu?</a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              loading={loading}
              size="large"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center text-sm text-gray-500">
          Bạn chưa có tài khoản? <a href="#" className="text-blue-500 hover:underline">Đăng ký</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
