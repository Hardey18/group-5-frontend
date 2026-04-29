// lib/react-query/user.queries.ts
import { useQuery } from "@tanstack/react-query";
import { getUserIdFromToken } from "@/lib/utils/decode-token";
import { getUserProfile } from "../api/services/user-service";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const userId = getUserIdFromToken(token);
      return await getUserProfile(userId);
    },
  });
};