import { api } from "../axios";
import { ApiResponse, ClientDashboardDTO } from "@/types/client-dashboard";

export const getClientDashboardData = async (): Promise<ApiResponse<ClientDashboardDTO>> => {
  const response = await api.get<ApiResponse<ClientDashboardDTO>>("/Call/dashboard/client");
  return response.data;
};
