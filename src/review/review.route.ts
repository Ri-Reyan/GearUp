import express from "express";
import { reviewController } from "./review.controller.js";
import { UserRole } from "@prisma/client";
import { authMidleware } from "../auth/auth.middleware.js";

const reviewRouter = express.Router();
reviewRouter.post(
  "/reviews",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.customer),
  reviewController.createReview,
);
export default reviewRouter;
