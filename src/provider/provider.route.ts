import express from "express";
import { providerControllers } from "./provider.controller.js";
import { authMidlleware } from "../auth/auth.middleware.js";
import { UserRole } from "@prisma/client";

const providerRoute = express.Router();

providerRoute.post(
  "/gear",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.provider),
  providerControllers.addGear,
);

providerRoute.put(
  "/gear/:id",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.provider),
  providerControllers.updateGear,
);

export default providerRoute;
