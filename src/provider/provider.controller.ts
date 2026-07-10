import HttpStatus from "http-status";
import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { IAddGearType } from "./provider.interace.js";
import sendResponse from "../utils/responce.js";
import { providerService } from "./provider.service.js";

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
  const gearId = req.params;

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

export const gearControllers = {
  addGear,
  updateGear,
};
