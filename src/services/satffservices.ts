import { ApiResponse } from "@/types/apiresponse";
import { Employee } from "@/types/employeetype";
import axiosInstance from "./api";

const ENDPOINT = "/employees";

// console.log("Params:", params); // Removed as 'params' is not defined
export const getEmployees = async (
  params: { page: number; pageSize: number; search: string }
): Promise<{
  data: Employee[];
  totalRecords: number;
  totalPages: number;
  page: number;
  pageSize: number;
}> => {
  // Constructing the URL parameters for pagination and search
  const queryParams = {
    page: params.page.toString(),
    limit: params.pageSize.toString(),
    search: params.search || "", // Make sure 'search' is passed as an empty string if not provided
  };

  try {
    // Gọi API với phân trang và tìm kiếm
    const response = await axiosInstance.get<Employee[]>(ENDPOINT, { params: queryParams });

    // Gọi API toàn bộ để đếm tổng số phần tử
    const totalRes = await axiosInstance.get<Employee[]>(ENDPOINT, { params: { search: params.search || "" } });
    const totalCount = totalRes.data.length;

    // Tính toán tổng số trang
    const totalPages = Math.ceil(totalCount / params.pageSize);

    return {
      data: response.data || [],
      totalRecords: totalCount,
      totalPages,
      page: params.page,
      pageSize: params.pageSize,
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};


export const getEmployeeById = async (
  id: string
): Promise<ApiResponse<Employee>> => {
  try {
    const response = await axiosInstance.get<Employee>(`${ENDPOINT}/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || "Failed to fetch employee",
    };
  }
};
// Hàm tạo mới nhân viên
export const createEmployee = async (
  data: Omit<Employee, "id">
): Promise<ApiResponse<Employee>> => {
  try {
    const response = await axiosInstance.post<Employee>(ENDPOINT, data); // Gửi yêu cầu POST
    return {
      success: true,
      data: response.data, // Trả về đối tượng Employee đã tạo
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || "Failed to create employee",
    };
  }
};

// Hàm cập nhật thông tin nhân viên
// Hàm cập nhật thông tin nhân viên
export const updateEmployee = async (
  id: string,
  data: Partial<Employee>
): Promise<ApiResponse<Employee>> => {
  try {
    const response = await axiosInstance.put<Employee>(
      `${ENDPOINT}/${id}`,
      data
    ); // Gửi yêu cầu PUT
    return {
      success: true,
      data: response.data, // Trả về đối tượng Employee đã cập nhật
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || "Failed to update employee",
    };
  }
};

export const deleteEmployee = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
    return { success: true, data: null };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || "Lỗi khi xóa nhân viên",
    };
  }
};

// Hàm xóa nhiều nhân viên
export const deleteMultipleEmployees = async (
  employees: Employee[]
): Promise<ApiResponse<null>> => {
  try {
    console.log("Danh sách ID cần xóa:", employees.map((employee) => employee.id));
    await Promise.all(
      employees.map((employee) =>
        axiosInstance.delete(`${ENDPOINT}/${employee.id}`)
      )
    );
    return { success: true, data: null };
  } catch (error: any) {
    console.error("Lỗi khi xóa nhiều nhân viên:", error);
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || "Lỗi khi xóa nhiều nhân viên",
    };
  }
};
