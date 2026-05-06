import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useDashboardData = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["dashboard-predictions", page, pageSize],
    queryFn: async () => {
      const res = await api.get(`/Dashboard/Get-All-Prediction?page=${page}&pageSize=${pageSize}`);
      return res.data;
    },
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
  });
};
