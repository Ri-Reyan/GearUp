import { Response } from "express";

type IDataType<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  error?: unknown;
  data?: T;
};

const sendResponse = <T>(res: Response, payload: IDataType<T>) => {
  return res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    error: payload.error,
  });
};

export default sendResponse;
