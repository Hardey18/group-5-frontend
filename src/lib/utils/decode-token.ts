import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  exp: number;
};

export const getUserIdFromToken = (token: string): string => {
  const decoded = jwtDecode<JwtPayload>(token);

  return decoded[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
  ];
};