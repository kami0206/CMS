// apiresponse.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  meta?: {
    totalRecords: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
}
