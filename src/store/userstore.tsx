import Api from '@/services/api';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const useAuthStore = create(
  combine(
    {
      accessToken: localStorage.getItem('accessToken') || "",
      imgUrl: localStorage.getItem('imgUrl') || "", 
      userName: localStorage.getItem('userName') || ""
    },
    (set) => ({
      setAccessToken: (newAccessToken: string) => {
        localStorage.setItem('accessToken', newAccessToken); // Lưu accessToken vào localStorage
        set({ accessToken: newAccessToken });
      },
      setImgUrl: (newImgUrl: string) => {
        localStorage.setItem('imgUrl', newImgUrl); // Lưu imgUrl vào localStorage
        set({ imgUrl: newImgUrl });
      },
      setUserName: (newUserName: string) => {
        localStorage.setItem('userName', newUserName); // Lưu userName vào localStorage
        set({ userName: newUserName });
      },
      logout: () => {
        localStorage.removeItem('accessToken'); // Xóa accessToken khỏi localStorage
        localStorage.removeItem('imgUrl'); // Xóa imgUrl khỏi localStorage
        localStorage.removeItem('userName'); // Xóa userName khỏi localStorage
        set({
          accessToken: "",
          imgUrl: "",
          userName: ""
        });
      },
      // Đăng nhập: kiểm tra email và password trong mock API
      fetchUserData: async (email: string, password: string) => {
        try {
          const response = await Api.get('/users');
          interface User {
            email: string;
            password: string;
            access_token: string;
            avatar: string;
            name: string;
          }

          const user = response.data.find(
            (u: User) => u.email === email && u.password === password
          );

          if (user) {
            set({
              accessToken: user.access_token,
              imgUrl: user.avatar,
              userName: user.name
            });
            // Lưu thông tin người dùng vào localStorage khi đăng nhập thành công
            localStorage.setItem('accessToken', user.access_token);
            localStorage.setItem('imgUrl', user.avatar);
            localStorage.setItem('userName', user.name);
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error("Lỗi khi fetch user:", error);
          return false;
        }
      }
    })
  )
);

export default useAuthStore;
