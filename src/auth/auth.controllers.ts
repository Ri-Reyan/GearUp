import type { Request, Response } from "express";
import { IUserLoginType, IUserRegisterPayload } from "./auth.interface.js";
import { authService } from "./auth.services.js";
import { token } from "../utils/token.js";
import sendResponse from "../utils/responce.js";
import HttpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";

const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const payload: IUserRegisterPayload = req.body;

    const result = await authService.registerUserIntoDb(payload);

    const accessToken = token.generateToken(
      {
        id: result.id,
        email: result.email,
        role: result.email,
      },
      process.env.JWT_ACCESS_SECRET as string,
      process.env.JWT_ACCESS_TIME as string,
    );

    const refreshToken = token.generateToken(
      {
        id: result.id,
        email: result.email,
        role: result.email,
      },
      process.env.JWT_REFRESH_SECRET as string,
      process.env.JWT_REFRESH_TIME as string,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "User created successfull",
      data: result,
    });
  },
);

const loginUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const payload: IUserLoginType = req.body;

  const user = await authService.loginUserIntoDb(payload);

  const accessToken = token.generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_TIME as string,
  );

  const refreshToken = token.generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET as string,
    process.env.JWT_REFRESH_TIME as string,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "User login successfull",
    data: user,
  });
});

const getMe = expressAsyncHandler(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await authService.getMeFromDb(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User profile retrieved successfully",
      data: result,
    });
  },
);

export const authControllers = {
  registerUser,
  loginUser,
  getMe,
};
