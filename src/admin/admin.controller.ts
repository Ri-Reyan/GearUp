import HttpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import sendResponse from "../utils/responce.js";

const getAllUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "All user retrived successfully",
    data: users,
  });
});

const updateUserStatus = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const userId = req.params.id as string;

    if (!userId) {
      throw new Error("User id is missing");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status,
      },
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User status updated successfully",
      data: updatedUser,
    });
  },
);

const getAllGearList = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const gears = await prisma.gearInventory.findMany();

    if (!gears) {
      throw new Error("Something went wrong");
    }

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "All gear list retrived successfully",
      data: gears,
    });
  },
);

const getAllOrders = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const orders = await prisma.rentalOrder.findMany();

    if (!orders) {
      throw new Error("Something went wrong");
    }

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "ALl orders retyrived successfully",
      data: orders,
    });
  },
);

export const adminController = {
  getAllUser,
  updateUserStatus,
  getAllGearList,
  getAllOrders,
};
