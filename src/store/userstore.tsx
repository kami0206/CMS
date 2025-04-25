// types/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import User, { LoginProps } from '@/types/usertype'; // Adjust paths as needed
import axiosInstance from '@/services/api';

// Define the AuthState interface
export interface AuthState {
  token?: string;
  user?: User;
  error?: string;
  loading?: boolean;
  isAuth?: boolean;

  loginUser: (props: LoginProps) => Promise<void>;
  logoutUser: () => Promise<void>;
}

// Custom storage implementation to handle JSON parsing/stringifying
const customStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    try {
      const valueToStore = JSON.stringify(value);
      localStorage.setItem(name, valueToStore);
    } catch (e) {
      console.error("Error storing data", e);
    }
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      error: undefined,
      loading: false,
      isAuth: false,

      loginUser: async (props: LoginProps) => {
        set({ loading: true, error: undefined });

        try {
          // Simulate an API call to log the user in
          const res = await axiosInstance.get<User[]>(`/users?email=${props.email}`);
          const user = res.data.find(u => u.email === props.email && u.password === props.password);

          if (user) {
            // Simulate the token, replace with actual logic if necessary
            const token = 'mockToken';

            set({
              user,
              token,
              isAuth: true,
              loading: false,
              error: undefined,
            });
          } else {
            set({
              loading: false,
              error: 'Invalid email or password',
            });
          }
        } catch (err: any) {
          set({
            loading: false,
            error: err.message || 'Login failed',
          });
        }
      },

      logoutUser: async () => {
        set({
          user: undefined,
          token: undefined,
          isAuth: false,
        });
      },
    }),
    {
      name: 'auth-storage', // Store name for persistence
      storage: customStorage, // Use custom storage with JSON serialization/deserialization
    }
  )
);

export default useAuthStore;
