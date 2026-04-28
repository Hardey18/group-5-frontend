export interface User {
  _id: string;
  name?: string;
  avatar?: string;
  email?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;

  [key: string]: unknown;
}
