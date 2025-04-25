import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/userstore"; // Assuming the store is in this path
import { LoginProps } from "@/types/usertype"; // Adjust the path accordingly

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.loginUser);
  const error = useAuthStore((state) => state.error);
  const loading = useAuthStore((state) => state.loading);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: LoginProps = { email, password };

    try {
      await loginUser(credentials); // Call the login function from Zustand store

      // If login is successful, navigate to the dashboard
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-3xl font-semibold mb-6 text-center text-orange-600">Welcome Back</h2>

        {/* Display error if login fails */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-orange-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-orange-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Don't have an account? <a href="/signup" className="text-orange-600 hover:underline">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
