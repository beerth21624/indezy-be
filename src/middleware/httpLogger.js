"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const httpLogger = (req, res, next) => {
    const { method, url } = req;
    const start = Date.now();
    res.on("finish", () => {
        const { statusCode } = res;
        const responseTime = Date.now() - start;
        logger_1.default.http(`${method} ${url} ${statusCode} - ${responseTime}ms`);
    });
    next();
};
exports.default = httpLogger;
