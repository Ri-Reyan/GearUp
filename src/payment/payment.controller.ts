import HttpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { paymentService } from "./payment.service.js";
import sendResponse from "../utils/response.js";

const createPayment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { rentalOrderId } = req.body;
    const result = await paymentService.createPaymentIntentInDb(rentalOrderId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Payment intent created successfully",
      data: result,
    });
  },
);

const confirmPayment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { transactionId } = req.body;
    const result = await paymentService.confirmPaymentInDb(transactionId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Payment confirmed and order placed successfully",
      data: result,
    });
  },
);

const getPaymentHistory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const result = await paymentService.getPaymentHistoryFromDb(userId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  },
);

const getPaymentDetails = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await paymentService.getPaymentDetailsFromDb(id as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Payment details retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getPaymentDetails,
};
