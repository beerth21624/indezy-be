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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.clearCache = exports.cacheMiddleware = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const logger_1 = __importDefault(require("../utils/logger"));
const DEFAULT_EXPIRATION = 3600; // 1 hour
const CACHE_STALE_TIME = 60; // 1 minute
const cacheMiddleware = (duration = DEFAULT_EXPIRATION) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `__express__${req.originalUrl || req.url}`;
        try {
            const cachedResponse = yield redis_1.default.get(key);
            if (cachedResponse) {
                const cacheData = JSON.parse(cachedResponse);
                const now = Date.now();
                const isStale = now - cacheData.lastUpdated > CACHE_STALE_TIME * 1000;
                // ส่งข้อมูลจาก cache ก่อน
                res.json(cacheData.data);
                if (isStale) {
                    // อัพเดตข้อมูลในพื้นหลังถ้าข้อมูลเก่าเกินไป
                    updateCacheInBackground(req, key, duration);
                }
                return;
            }
            // ถ้าไม่มีข้อมูลใน cache, ดำเนินการปกติและเก็บผลลัพธ์
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
    });
};
exports.cacheMiddleware = cacheMiddleware;
function updateCacheInBackground(req, key, duration) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // จำลองการเรียก API จริงโดยใช้ fetch หรือ axios
            const response = yield fetch(req.url, {
                method: req.method,
                headers: req.headers,
                body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
            });
            const data = yield response.json();
            const cacheData = {
                data,
                lastUpdated: Date.now(),
            };
            yield redis_1.default.setEx(key, duration, JSON.stringify(cacheData));
            logger_1.default.info(`Cache updated in background for key: ${key}`);
        }
        catch (error) {
            logger_1.default.error("Error updating cache in background:", error);
        }
    });
}
const clearCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis_1.default.del(key);
        logger_1.default.info(`Cache cleared for key: ${key}`);
    }
    catch (error) {
        logger_1.default.error("Clear cache error:", error);
    }
});
exports.clearCache = clearCache;
const invalidateCache = (pattern) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keys = yield redis_1.default.keys(pattern);
        if (keys.length > 0) {
            yield redis_1.default.del(keys);
            logger_1.default.info(`Cache invalidated for pattern: ${pattern}`);
        }
    }
    catch (error) {
        logger_1.default.error("Invalidate cache error:", error);
    }
});
exports.invalidateCache = invalidateCache;
