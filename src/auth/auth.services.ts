import { prisma } from "../lib/prisma.js";
import { UserRole } from "@prisma/client";
import {
  ILoginReturnType,
  IUserLoginType,
  IUserRegisterPayload,
} from "./auth.interface.js";
import bcrypt from "bcrypt";

const registerUserIntoDb = async (payload: IUserRegisterPayload) => {
  const { name, email, password, role }: IUserRegisterPayload = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User alraedy exits");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(process.env.SALT_ROUND),
  );

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
    },
    omit: {
      password: true,
    },
  });

  return newUser;
};

const loginUserIntoDb = async (payload: IUserLoginType) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isMatched = await bcrypt.compare(
    password as string,
    user.password as string,
  );

  if (!isMatched) {
    throw new Error("Invalid credentials");
  }

  const { id, name, role, accountStatus, createdAt, updatedAt } = user;

  const result: ILoginReturnType = {
    id,
    name,
    email,
    role,
    accountStatus,
    createdAt,
    updatedAt,
  };

  return result;
};

const getMeFromDb = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
  });
};

export const authService = {
  registerUserIntoDb,
  loginUserIntoDb,
  getMeFromDb,
};
