import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const start = Date.now();

  res.on("finish", () => {
    const { statusCode } = res;
    const responseTime = Date.now() - start;
    logger.http(`${method} ${url} ${statusCode} - ${responseTime}ms`);
  });

  next();
};

export default httpLogger;
