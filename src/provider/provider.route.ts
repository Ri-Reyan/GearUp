import express from "express";
import { providerControllers } from "./provider.controller.js";
import { authMidleware } from "../auth/auth.middleware.js";
import { UserRole } from "@prisma/client";

const providerRoute = express.Router();

providerRoute.post(
  "/gear",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.provider),
  providerControllers.addGear,
);

providerRoute.put(
  "/gear/:id",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.provider),
  providerControllers.updateGear,
);

providerRoute.delete(
  "/gear/:id",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.provider, UserRole.admin),
  providerControllers.deleteGear,
);

providerRoute.get(
  "/orders",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.provider),
  providerControllers.getOrder,
);

providerRoute.patch(
  "/orders/:id",
  authMidleware.verifyUser,
  authMidleware.verifyRole(UserRole.provider),
  providerControllers.updateOrderStatus,
);

export default providerRoute;
