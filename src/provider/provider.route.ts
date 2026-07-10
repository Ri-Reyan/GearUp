import express from "express";
import { gearControllers } from "./provider.controller.js";
import { authMidlleware } from "../auth/auth.middleware.js";
import { UserRole } from "@prisma/client";

const providerRoute = express.Router();

providerRoute.post(
  "/gear",
  authMidlleware.verifyUser,
  authMidlleware.verifyRole(UserRole.provider),
  gearControllers.addGear,
);

export default providerRoute;
