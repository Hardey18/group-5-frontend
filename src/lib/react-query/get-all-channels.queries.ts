import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useAllChannels = () => {
  return useQuery({
    queryKey: ["all-channels"],
    queryFn: async () => {
      const res = await api.get(`/Channel`);
      return res.data;
    }
  });
};
