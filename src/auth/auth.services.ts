import { prisma } from "../lib/prisma.js";
import {
  ILoginReturnType,
  IUserLoginType,
  IUserRegisterPayload,
} from "./auth.interface.js";
import bcrypt from "bcrypt";

const registerUserIntoDb = async (payload: IUserRegisterPayload) => {
  const { name, email, password }: IUserRegisterPayload = payload;

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
    },
    omit: {
      password: true,
    },
  });

  return newUser;
};

export const authService = {
  registerUserIntoDb,
};
