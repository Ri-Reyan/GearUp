import express from "express";
import { authControllers } from "./auth.controllers.js";
import { authMidleware } from "./auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/register", authControllers.registerUser);
authRoute.post("/login", authControllers.loginUser);
authRoute.post("/logout", authControllers.logoutUser);
authRoute.get("/me", authMidleware.verifyUser, authControllers.getMe);

export default authRoute;
