import { Request, Response, NextFunction } from "express";
import { createClient, RedisClientType } from "redis";

// Define custom types
type CustomResponse<T = any> = Response<T> & {
  originalJson?: Response['json'];
};

class RedisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RedisError";
  }
}

// Create a Redis client
const redisClient: RedisClientType = createClient({
  url: "redis://default:12345678@119.59.102.14:6378",
});

let isRedisConnected = false;

// Connect to Redis
const connectToRedis = async () => {
  try {
    await redisClient.connect();
    isRedisConnected = true;
    console.log("Connected to Redis successfully");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    isRedisConnected = false;
  }
};

// Initial connection attempt
connectToRedis();

// Handle Redis errors
redisClient.on("error", (err: Error) => {
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

const safeRedisOperation = async <T>(operation: () => Promise<T>): Promise<T | null> => {
  if (!isRedisConnected) {
    return null;
  }
  try {
    return await operation();
  } catch (error) {
    console.error("Redis operation failed:", error);
    isRedisConnected = false;
    return null;
  }
};

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: CustomResponse, next: NextFunction) => {
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl;
    
    const cachedData = await safeRedisOperation(() => redisClient.get(key));
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    res.originalJson = res.json;
    res.json = function (body: any) {
      if (isRedisConnected) {
        safeRedisOperation(() => redisClient.set(key, JSON.stringify(body), { EX: duration }));
      }
      return res.originalJson!(body);
    } as Response['json'];
    
    next();
  };
};

export const clearCache = async (keys: string[]): Promise<void> => {
  if (isRedisConnected) {
    await Promise.all(keys.map(key => safeRedisOperation(() => redisClient.del(key))));
  }
};