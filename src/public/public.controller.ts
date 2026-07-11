import HttpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import sendResponse from "../utils/response.js";

const getGears = expressAsyncHandler(async (req: Request, res: Response) => {
  const gears = await prisma.gearInventory.findMany();

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "All gears retrived successfully",
    data: gears,
  });
});

const getGearById = expressAsyncHandler(async (req: Request, res: Response) => {
  const gearId = req.params.id;

  const gear = await prisma.gearInventory.findUniqueOrThrow({
    where: {
      id: gearId as string,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Gear retrived successfully",
    data: gear,
  });
});

const getCategories = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const categories = await prisma.categories.findMany();

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "all categories retrived successfully",
      data: categories,
    });
  },
);

export const publicController = {
  getGears,
  getGearById,
  getCategories,
};
