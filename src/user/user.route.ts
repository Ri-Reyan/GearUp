import express from "express";
import { authMidlleware } from "../auth/auth.middleware.js";
import { UserRole } from "@prisma/client";
import { userController } from "./user.controllers.js";

const userRouter = express.Router();

userRouter.get(
  "/rentals",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.user),
  userController.getUsersOrder,
);

userRouter.get(
  "/rentals/:id",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.user),
  userController.getRentalOrderById,
);

userRouter.post(
  "/rentals",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.user),
  userController.placeOrder,
);

export default userRouter;
