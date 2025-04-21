import Api from "@/services/api";
import { Employee } from "@/types/employeetype";

// Lấy danh sách nhân viên
export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await Api.get("/staff");
  return response.data;
};

// Xóa nhân viên
export const deleteEmployee = async (id: string): Promise<void> => {
  await Api.delete(`/staff/${id}`);
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (
  id: string,
  values: Partial<Employee>
): Promise<Employee> => {
  const response = await Api.put(`/staff/${id}`, values);
  return response.data;
};