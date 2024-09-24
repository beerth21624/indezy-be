import expressWinston from "express-winston";
import winston from "winston";
import path from "path";
import "winston-daily-rotate-file";

// Configuration object
const config = {
  logDirectory: process.env.LOG_DIR || "logs",
  errorLogFileName: "error-%DATE%.log",
  combinedLogFileName: "combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
};

// Custom log format for console
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} ${level}: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Configure the Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(config.logDirectory, config.errorLogFileName),
      datePattern: config.datePattern,
      zippedArchive: config.zippedArchive,
      maxSize: config.maxSize,
      maxFiles: config.maxFiles,
      level: "error",
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(config.logDirectory, config.combinedLogFileName),
      datePattern: config.datePattern,
      zippedArchive: config.zippedArchive,
      maxSize: config.maxSize,
      maxFiles: config.maxFiles,
    }),
  ],
});

// If we're not in production, add colorful console logging
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Create the middleware
const loggerMiddleware = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: true,
});

export { loggerMiddleware, logger };
