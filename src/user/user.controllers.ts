import HttpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import sendResponse from "../utils/response.js";
import { IPlaceOrderType } from "./user.interface.js";
import { AccountStatus } from "@prisma/client";

const getUsersOrder = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User id missing");
    }

    const orders = await prisma.rentalOrder.findMany({
      where: {
        userId,
        user: {
          accountStatus: AccountStatus.ACTIVE,
        },
      },
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "All orders are retrived successfully",
      data: orders,
    });
  },
);

const getRentalOrderById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.id;

    const userId = req.user?.id;

    const order = await prisma.rentalOrder.findUniqueOrThrow({
      where: {
        id: orderId as string,
        userId,
        user: {
          accountStatus: AccountStatus.ACTIVE,
        },
      },
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Order retrived successfully",
      data: order,
    });
  },
);

const placeOrder = expressAsyncHandler(async (req: Request, res: Response) => {
  const { gearId, location, quantity }: IPlaceOrderType = req.body;

  const userId = req.user?.id;

  if (!userId) {
    throw new Error("User id is missing");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const gear = await prisma.gearInventory.findUniqueOrThrow({
    where: {
      id: gearId as string,
    },
  });

  const price = Math.ceil(quantity * Number(gear.price));

  const newOrder = await prisma.rentalOrder.create({
    data: {
      quantity,
      total_price: price,
      location,
      gearId,
      userId,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "New order placed successfully",
    data: newOrder,
  });
});

export const userController = {
  getUsersOrder,
  getRentalOrderById,
  placeOrder,
};
