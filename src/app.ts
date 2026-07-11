import express from "express";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import authRoute from "./auth/auth.routes.js";
import cookieParser from "cookie-parser";
import providerRoute from "./provider/provider.route.js";
import publicRouter from "./public/public.route.js";
import userRouter from "./user/user.route.js";
import adminRouter from "./admin/admin.route.js";
import { prisma } from "./lib/prisma.js";
import paymentRouter from "./payment/review.route.js";
import reviewRouter from "./review/review.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/provider", providerRoute);
app.use("/api", publicRouter);
app.use("/api", userRouter);
app.use("/api/admin", adminRouter);

app.use("/api/payments", paymentRouter);
app.use("/api/reviews", reviewRouter);

app.get("/", async () => {
  await prisma.user.deleteMany();
});

app.use(globalErrorHandler);

export default app;
