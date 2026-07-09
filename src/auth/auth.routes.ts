import express from "express";
import { authControllers } from "./auth.controllers.js";

const authRoute = express.Router();

authRoute.post("/register", authControllers.registerUser);
authRoute.post("/login", authControllers.loginUser);
export default authRoute;
