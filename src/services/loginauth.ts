import { ApiResponse } from "@/types/apiresponse";
import User, { LoginProps } from "@/types/usertype";
import axiosInstance from "./api";


export const login = async (props: LoginProps): Promise<ApiResponse<User>> => {
  try {
    const { email, password } = props;

    // Tìm user theo email
    const res = await axiosInstance.get<User[]>(`/users?email=${email}`);

    const user = res.data.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // Mock token nếu cần (hoặc lấy từ user.access_token nếu có sẵn trong mockapi)
      return {
        success: true,
        data: {
          ...user,
        },
      };
    } else {
      return { success: false, data: null, error: "Email hoặc mật khẩu không đúng" };
    }
  } catch (err: any) {
    return { success: false, data: null, error: err.message || "Đăng nhập thất bại" };
  }
};
