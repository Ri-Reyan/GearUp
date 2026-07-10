import HttpStatus from "http-status";
import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { IAddGearType } from "./provider.interace.js";
import sendResponse from "../utils/responce.js";
import { providerService } from "./provider.service.js";
import { prisma } from "../lib/prisma.js";
import { OrderStatus } from "@prisma/client";

const addGear = expressAsyncHandler(async (req: Request, res: Response) => {
  const payload: IAddGearType = req.body;
  const ownerId = req.user?.id;

  if (!ownerId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const result = await providerService.addGearIntoDb(ownerId, payload);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Gear added to inventory successfully",
    data: result,
  });
});

const updateGear = expressAsyncHandler(async (req: Request, res: Response) => {
  const gearId = req.params.id;

  if (typeof gearId !== "string") {
    throw new Error("Gear id must be string");
  }

  const result = await providerService.updateGearIntoDb(
    req.user?.id as string,
    gearId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Gear updated successfully",
    data: result,
  });
});

const deleteGear = expressAsyncHandler(async (req: Request, res: Response) => {
  const gearId = req.params.id;

  const gear = await prisma.gearInventory.findUniqueOrThrow({
    where: {
      id: gearId as string,
    },
  });

  if (req.user?.role !== "admin" && gear.ownerId !== req.user?.id) {
    throw new Error("You are not allowed to delete this gear");
  }

  await prisma.gearInventory.delete({
    where: {
      id: gearId as string,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Gear deleted successfully",
    data: null,
  });
});

const getOrder = expressAsyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user?.id;

  if (!ownerId) {
    res.status(401);
    throw new Error("Unauthorized - Owner identity not found");
  }

  const orders = await providerService.getOrdersFromDb(ownerId as string);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "All order retrived successfully",
    data: orders,
  });
});

const updateOrderStatus = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.id;

    const ownerId = req.user?.id;

    const status: string = req.body;

    const order = await providerService.updateOrderStatusIntoDb(
      ownerId as string,
      orderId as string,
      status as OrderStatus,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Order statsu updated successfully",
      data: order,
    });
  },
);

export const providerControllers = {
  addGear,
  updateGear,
  deleteGear,
  getOrder,
  updateOrderStatus,
};
