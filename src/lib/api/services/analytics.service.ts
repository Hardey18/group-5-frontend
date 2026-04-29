import { api } from "../axios";
import { ApiResponse, AnalyticsDashboardDTO } from "@/types/analytics";

export const getAnalyticsDashboardData = async (days: number): Promise<ApiResponse<AnalyticsDashboardDTO>> => {
  const response = await api.get<ApiResponse<AnalyticsDashboardDTO>>(`/call/dashboard/analytics?days=${days}`);
  return response.data;
};
