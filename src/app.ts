import express from "express";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import authRoute from "./auth/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
