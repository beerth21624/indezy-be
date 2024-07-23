"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFound = exports.errorHandler = exports.AppError = void 0;
const client_1 = require("@prisma/client");
// Custom error class for application-specific errors
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Error handler middleware
const errorHandler = (err, res) => {
    console.error("Error:", err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Handle Prisma errors
        handlePrismaError(err, res);
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
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
exports.errorHandler = errorHandler;
// Helper function to handle Prisma-specific errors
const handlePrismaError = (err, res) => {
    var _a, _b, _c;
    switch (err.code) {
        case "P2002":
            res.status(409).json({
                status: "error",
                message: "ข้อมูลซ้ำกัน",
                details: `มีข้อมูล ${(_b = (_a = err.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.join(", ")} นี้อยู่ในระบบแล้ว`,
            });
            break;
        case "P2025":
            res.status(404).json({
                status: "error",
                message: "ไม่พบข้อมูล",
                details: (_c = err.meta) === null || _c === void 0 ? void 0 : _c.cause,
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
const notFound = (req, next) => {
    const error = new AppError(`ไม่พบ URL - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
// Async handler to catch errors in async functions
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
exports.default = {
    AppError,
    errorHandler: exports.errorHandler,
    notFound: exports.notFound,
    asyncHandler: exports.asyncHandler,
};
