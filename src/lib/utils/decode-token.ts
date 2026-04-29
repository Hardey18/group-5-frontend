/* eslint-disable import/no-named-as-default */
// lib/utils/decode-token.ts
import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token: string): string => {
  const decoded: any = jwtDecode(token);

  return decoded[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
  ];
};