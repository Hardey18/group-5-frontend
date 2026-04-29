// lib/api/services/auth.service.ts
import { api } from "../axios";

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/User/login", {
    emailOrUserName: data.email,
    password: data.password,
    clientId: "web",
  });

  if (!res.data.success || !res.data.data?.succeeded) {
    throw new Error(res.data.message || "Login failed");
  }

  return {
    token: res.data.data.token,
    refreshToken: res.data.data.refreshToken,
  };
};

export const register = async (data: {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	phoneNumber: string;
}) => {
	const res = await api.post("/auth/register", data);
	return res.data;
};

export const forgotPassword = async (email: string) => {
	const res = await api.post("/auth/forgotPassword", { email });
	return res.data;
};

export const changePassword = async (data: any) => {
	const res = await api.post("/auth/changePassword", data);
	return res.data;
};
