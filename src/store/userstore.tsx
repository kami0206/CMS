import Api from '@/services/api';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const useAuthStore = create(
  combine(
    {
      accessToken: "",
      imgUrl: "",
      userName: ""
    },
    (set) => ({
      setAccessToken: (newAccessToken: string) => {
        set({ accessToken: newAccessToken });
      },
      setImgUrl: (newImgUrl: string) => {
        set({ imgUrl: newImgUrl });
      },
      setUserName: (newUserName: string) => {
        set({ userName: newUserName });
      },
      logout: () => {
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