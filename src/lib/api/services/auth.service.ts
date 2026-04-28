// lib/api/services/auth.service.ts
import { api } from "../axios";

export const login = async (data: { email: string; password: string }) => {
	const res = await api.post("/auth/login", data);

	const { accessToken, user, message } = res.data;

	return {
		token: accessToken,
		user,
		message,
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
