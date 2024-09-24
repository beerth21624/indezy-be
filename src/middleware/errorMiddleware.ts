// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

// Custom error class for application-specific errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  res: Response,
): void => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    handlePrismaError(err, res);
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      status: "error",
      message: "ข้อมูลไม่ถูกต้อง",
      details: err.message,
    });
    return;
  }

  // For unhandled errors
  res.status(500).json({
    status: "error",
    message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
  });
};

// Helper function to handle Prisma-specific errors
const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
): void => {
  switch (err.code) {
    case "P2002":
      res.status(409).json({
        status: "error",
        message: "ข้อมูลซ้ำกัน",
        details: `มีข้อมูล ${(err.meta?.target as string[])?.join(
          ", "
        )} นี้อยู่ในระบบแล้ว`,
      });
      break;
    case "P2025":
      res.status(404).json({
        status: "error",
        message: "ไม่พบข้อมูล",
        details: err.meta?.cause as string,
      });
      break;
    default:
      res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดในการเข้าถึงฐานข้อมูล",
        details: err.message,
      });
  }
};

// Not Found middleware
export const notFound = (
  req: Request,
  next: NextFunction
): void => {
  const error = new AppError(`ไม่พบ URL - ${req.originalUrl}`, 404);
  next(error);
};

// Async handler to catch errors in async functions
export const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default {
  AppError,
  errorHandler,
  notFound,
  asyncHandler,
};
