import type { JwtPayload } from "jsonwebtoken";

export type IUserRegisterPayload = {
  name: string;
  email: string;
  password: string;
  accountStatus?: string;
  role?: string;
};

export type IUserLoginType = {
  email: string;
  password: string;
};

export type ILoginReturnType = {
  id: string;
  name: string;
  email: string;
  accountStatus: string;
  role: string;
  createdAt: any;
  updatedAt: any;
};

export interface IJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}
