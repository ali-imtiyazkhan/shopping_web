import { Response } from "express";

export const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any
) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  error?: any
) => {
  return res.status(status).json({
    success: false,
    message,
    error: error?.message || error,
  });
};
