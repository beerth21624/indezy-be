"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.clearCache = exports.cacheMiddleware = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const logger_1 = __importDefault(require("../utils/logger"));
const DEFAULT_EXPIRATION = 3600;
const CACHE_STALE_TIME = 60;
const cacheMiddleware = (duration = DEFAULT_EXPIRATION) => {
    return async (req, res, next) => {
        const key = `__express__${req.originalUrl || req.url}`;
        try {
            const cachedResponse = await redis_1.default.get(key);
            if (cachedResponse) {
                const cacheData = JSON.parse(cachedResponse);
                const now = Date.now();
                const isStale = now - cacheData.lastUpdated > CACHE_STALE_TIME * 1000;
                res.json(cacheData.data);
                if (isStale) {
                    updateCacheInBackground(req, key, duration);
                }
                return;
            }
            const originalJson = res.json;
            res.json = (body) => {
                const cacheData = {
                    data: body,
                    lastUpdated: Date.now(),
                };
                redis_1.default.setEx(key, duration, JSON.stringify(cacheData));
                return originalJson.call(res, body);
            };
            next();
        }
        catch (error) {
            logger_1.default.error("Cache middleware error:", error);
            next();
        }
    };
};
exports.cacheMiddleware = cacheMiddleware;
async function updateCacheInBackground(req, key, duration) {
    try {
        const response = await fetch(req.url, {
            method: req.method,
            headers: req.headers,
            body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
        });
        const data = await response.json();
        const cacheData = {
            data,
            lastUpdated: Date.now(),
        };
        await redis_1.default.setEx(key, duration, JSON.stringify(cacheData));
        logger_1.default.info(`Cache updated in background for key: ${key}`);
    }
    catch (error) {
        logger_1.default.error("Error updating cache in background:", error);
    }
}
const clearCache = async (key) => {
    try {
        await redis_1.default.del(key);
        logger_1.default.info(`Cache cleared for key: ${key}`);
    }
    catch (error) {
        logger_1.default.error("Clear cache error:", error);
    }
};
exports.clearCache = clearCache;
const invalidateCache = async (pattern) => {
    try {
        const keys = await redis_1.default.keys(pattern);
        if (keys.length > 0) {
            await redis_1.default.del(keys);
            logger_1.default.info(`Cache invalidated for pattern: ${pattern}`);
        }
    }
    catch (error) {
        logger_1.default.error("Invalidate cache error:", error);
    }
};
exports.invalidateCache = invalidateCache;
//# sourceMappingURL=cacheMiddleware.js.map