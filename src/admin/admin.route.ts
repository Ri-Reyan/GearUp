import express from "express";
import { authMidleware } from "../auth/auth.middleware.js";
import { UserRole } from "@prisma/client";
import { adminController } from "./admin.controller.js";

const adminRouter = express.Router();

adminRouter.get(
  "/users",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.admin),
  adminController.getAllUser,
);

adminRouter.patch(
  "/users/:id",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.admin),
  adminController.updateUserStatus,
);

adminRouter.get(
  "/gear",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.admin),
  adminController.getAllGearList,
);

adminRouter.get(
  "/rentals",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.admin),
  adminController.getAllOrders,
);

export default adminRouter;
