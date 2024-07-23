import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";
import logger from "../utils/logger";

const DEFAULT_EXPIRATION = 3600; // 1 hour
const CACHE_STALE_TIME = 60; // 1 minute

interface CacheData {
  data: any;
  lastUpdated: number;
}

export const cacheMiddleware = (duration: number = DEFAULT_EXPIRATION) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `__express__${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        const cacheData: CacheData = JSON.parse(cachedResponse);
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
      res.json = (body: any) => {
        const cacheData: CacheData = {
          data: body,
          lastUpdated: Date.now(),
        };
        redisClient.setEx(key, duration, JSON.stringify(cacheData));
        return originalJson.call(res, body);
      };

      next();
    } catch (error) {
      logger.error("Cache middleware error:", error);
      next();
    }
  };
};

async function updateCacheInBackground(
  req: Request,
  key: string,
  duration: number
) {
  try {
    // จำลองการเรียก API จริงโดยใช้ fetch หรือ axios
    const response = await fetch(req.url, {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    const cacheData: CacheData = {
      data,
      lastUpdated: Date.now(),
    };

    await redisClient.setEx(key, duration, JSON.stringify(cacheData));
    logger.info(`Cache updated in background for key: ${key}`);
  } catch (error) {
    logger.error("Error updating cache in background:", error);
  }
}

export const clearCache = async (key: string) => {
  try {
    await redisClient.del(key);
    logger.info(`Cache cleared for key: ${key}`);
  } catch (error) {
    logger.error("Clear cache error:", error);
  }
};

export const invalidateCache = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cache invalidated for pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error("Invalidate cache error:", error);
  }
};
