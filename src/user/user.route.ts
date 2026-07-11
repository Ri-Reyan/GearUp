import express from "express";
import { authMidleware } from "../auth/auth.middleware.js";
import { UserRole } from "@prisma/client";
import { userController } from "./user.controllers.js";

const userRouter = express.Router();

userRouter.get(
  "/rentals",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.user),
  userController.getUsersOrder,
);

userRouter.get(
  "/rentals/:id",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.user),
  userController.getRentalOrderById,
);

userRouter.post(
  "/rentals",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.user),
  userController.placeOrder,
);

export default userRouter;
