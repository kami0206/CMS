// src/services/staffApi.ts
import { Employee } from "@/types/employeetype";
import axiosInstance from "./api";

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await axiosInstance.get("/staff");
  return response.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/staff/${id}`);
};

export const updateEmployee = async (id: string, values: any): Promise<Employee> => {
  const response = await axiosInstance.put(`/staff/${id}`, values);
  return response.data;
};
