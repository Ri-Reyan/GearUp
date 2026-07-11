import express from "express";
import { authMidlleware } from "../auth/auth.middleware.js";
import { UserRole } from "@prisma/client";
import { adminController } from "./admin.controller.js";

const adminRouter = express.Router();

adminRouter.get(
  "/users",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.admin),
  adminController.getAllUser,
);

adminRouter.patch(
  "users/:id",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.admin),
  adminController.updateUserStatus,
);

adminRouter.get(
  "/gear",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.admin),
  adminController.getAllGearList,
);

adminRouter.get(
  "/rentals",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.admin),
  adminController.getAllOrders,
);

export default adminRouter;
