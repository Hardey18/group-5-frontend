import { useQuery } from "@tanstack/react-query";
import { getAnalyticsDashboardData } from "../api/services/analytics.service";

export const useAnalyticsDashboard = (days: number) => {
  return useQuery({
    queryKey: ["analytics-dashboard", days],
    queryFn: async () => {
      return await getAnalyticsDashboardData(days);
    },
  });
};
