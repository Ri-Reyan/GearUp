import type { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { token } from "../utils/token.js";
import { prisma } from "../lib/prisma.js";

const verifyUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new Error("Unauthorized access");
    }

    const decoded = token.verifyToken(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    );

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: decoded.id },
    });

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  },
);

const verifyRole = (...roles: string[]) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user?.role as string)) {
        throw new Error("You are not allowed");
      }

      next();
    },
  );

export const authMidlleware = {
  verifyUser,
  verifyRole,
};
