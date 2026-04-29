// lib/api/services/user.service.ts
import { api } from "../axios";

export const getUserProfile = async (userId: string) => {
  const res = await api.get(`/User/profile/${userId}`);

  if (!res.data.success) {
    throw new Error("Failed to fetch profile");
  }

  return res.data.data;
};

export const updateProfile = async (data: {
  userId: string;
  fullName: string;
  phoneNumber: string;
  profilePhotoUrl?: string;
}) => {
  const res = await api.put("/User/Profile", data);

  if (!res.data.success) {
    throw new Error(res.data.message || "Update failed");
  }

  return res.data;
};
