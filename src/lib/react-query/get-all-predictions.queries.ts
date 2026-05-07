import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useAllChurn = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["all-churn", page, pageSize],
    queryFn: async () => {
      const res = await api.get(`/Dashboard/Get-All-Prediction?page=${page}&pageSize=${pageSize}&churn=true`);
      return res.data;
    }
  });
};
