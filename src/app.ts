import express from "express";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import authRoute from "./auth/auth.routes.js";
import cookieParser from "cookie-parser";
import providerRoute from "./provider/provider.route.js";
import publicRouter from "./user/public.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/provider", providerRoute);
app.use("/api", publicRouter);

app.use(globalErrorHandler);

export default app;
