import express from "express";
import type { Request, Response } from "express";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import authRoute from "./auth/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
