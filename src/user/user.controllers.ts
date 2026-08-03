import HttpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import sendResponse from "../utils/response.js";
import { IPlaceOrderType } from "./user.interface.js";
import { AccountStatus, Availability } from "@prisma/client";

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
      include: {
        gear: {
          include: {
            order: true,
          },
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
  const {
    gearId,
    location,
    quantity,
    rentalDate,
    returnDate,
  }: IPlaceOrderType = req.body;

  const userId = req.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!quantity || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  if (!location?.trim()) {
    throw new Error("Location is required");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const gear = await prisma.gearInventory.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  if (gear.availability === Availability.OUT_OF_STOCK) {
    throw new Error("This gear is currently unavailable");
  }

  const rentalDateObj = new Date(rentalDate);
  const returnDateObj = new Date(returnDate);

  rentalDateObj.setHours(0, 0, 0, 0);
  returnDateObj.setHours(0, 0, 0, 0);

  // Rental date cannot be before today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (rentalDateObj < today) {
    throw new Error("Rental date cannot be before today");
  }

  // Return date must be after rental date
  if (returnDateObj <= rentalDateObj) {
    throw new Error("Return date must be after rental date");
  }

  const rentalDays = Math.ceil(
    (returnDateObj.getTime() - rentalDateObj.getTime()) / (1000 * 60 * 60 * 24),
  );

  const totalPrice = Math.ceil(Number(gear.price) * quantity * rentalDays);

  const newOrder = await prisma.rentalOrder.create({
    data: {
      quantity,
      total_price: totalPrice,
      location,
      rentalDate: rentalDateObj,
      returnDate: returnDateObj,
      gearId: gear.id,
      userId: user.id,
    },
    include: {
      gear: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "Rental order placed successfully",
    data: newOrder,
  });
});

export const userController = {
  getUsersOrder,
  getRentalOrderById,
  placeOrder,
};
