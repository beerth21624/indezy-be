"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.cacheMiddleware = void 0;
const redis_1 = require("redis");
class RedisError extends Error {
    constructor(message) {
        super(message);
        this.name = "RedisError";
    }
}
// Create a Redis client
const redisClient = (0, redis_1.createClient)({
    url: "redis://default:12345678@119.59.102.14:6378",
});
let isRedisConnected = false;
// Connect to Redis
const connectToRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
        isRedisConnected = true;
        console.log("Connected to Redis successfully");
    }
    catch (error) {
        console.error("Failed to connect to Redis:", error);
        isRedisConnected = false;
    }
});
// Initial connection attempt
connectToRedis();
// Handle Redis errors
redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
    isRedisConnected = false;
});
// Reconnection logic
setInterval(() => {
    if (!isRedisConnected) {
        console.log("Attempting to reconnect to Redis...");
        connectToRedis();
    }
}, 5000); // Try to reconnect every 5 seconds
const safeRedisOperation = (operation) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isRedisConnected) {
        return null;
    }
    try {
        return yield operation();
    }
    catch (error) {
        console.error("Redis operation failed:", error);
        isRedisConnected = false;
        return null;
    }
});
const cacheMiddleware = (duration) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.method !== "GET") {
            return next();
        }
        const key = req.originalUrl;
        const cachedData = yield safeRedisOperation(() => redisClient.get(key));
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
        res.originalJson = res.json;
        res.json = function (body) {
            if (isRedisConnected) {
                safeRedisOperation(() => redisClient.set(key, JSON.stringify(body), { EX: duration }));
            }
            return res.originalJson(body);
        };
        next();
    });
};
exports.cacheMiddleware = cacheMiddleware;
const clearCache = (keys) => __awaiter(void 0, void 0, void 0, function* () {
    if (isRedisConnected) {
        yield Promise.all(keys.map(key => safeRedisOperation(() => redisClient.del(key))));
    }
});
exports.clearCache = clearCache;
