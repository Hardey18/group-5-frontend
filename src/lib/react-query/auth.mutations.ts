// lib/react-query/auth.mutations.ts
import { useMutation } from "@tanstack/react-query";
import { login, register, forgotPassword } from "../api/services/auth.service";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};
