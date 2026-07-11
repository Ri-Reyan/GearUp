import HttpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { reviewService } from "./review.service.js";
import sendResponse from "../utils/response.js";

const createReview = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const result = await reviewService.createReviewIntoDb(userId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Review submitted successfully",
      data: result,
    });
  },
);

export const reviewController = { createReview };
