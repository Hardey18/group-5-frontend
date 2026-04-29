// lib/react-query/auth.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/services/user-service";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
