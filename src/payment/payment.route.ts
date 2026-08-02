import express from "express";
import { paymentController } from "./payment.controller.js";
import { authMidleware } from "../auth/auth.middleware.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create",
  authMidleware.verifyUser,
  paymentController.createPayment,
);

paymentRouter.post(
  "/confirm",
  authMidleware.verifyUser,
  paymentController.confirmPayment,
);

paymentRouter.get(
  "/",
  authMidleware.verifyUser,
  paymentController.getPaymentHistory,
);

paymentRouter.get(
  "/:id",
  authMidleware.verifyUser,
  paymentController.getPaymentDetails,
);

paymentRouter.get(
  "/success/:paymentId",
  authMidleware.verifyUser,
  paymentController.getSinglePayment,
);

export default paymentRouter;
