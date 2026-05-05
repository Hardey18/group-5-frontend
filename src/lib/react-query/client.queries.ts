import { useQuery } from "@tanstack/react-query";
import { getClientDashboardData } from "../api/services/client-service";

export const useClientDashboard = () => {
  return useQuery({
    queryKey: ["client-dashboard"],
    queryFn: async () => {
      return await getClientDashboardData();
    },
  });
};
