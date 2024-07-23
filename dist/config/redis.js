"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const logger_1 = __importDefault(require("../utils/logger"));
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => logger_1.default.error("Redis Client Error", err));
redisClient.on("connect", () => logger_1.default.info("Redis Client Connected"));
exports.default = redisClient;
//# sourceMappingURL=redis.js.map