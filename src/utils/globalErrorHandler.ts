import type { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  statusCode?: number;
}

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      name: err.name,
      message: err.message,
    },
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
