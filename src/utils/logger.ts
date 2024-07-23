
import winston from "winston";
import path from "path";

// กำหนดระดับของ log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// กำหนดสีสำหรับแต่ละระดับ
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// เพิ่มสีให้กับ winston
winston.addColors(colors);

// กำหนดรูปแบบของ log
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// กำหนด transports (วิธีการเก็บ log)
const transports = [
  // เก็บ error logs ในไฟล์
  new winston.transports.File({
    filename: path.join(__dirname, "../../logs/error.log"),
    level: "error",
  }),
  // เก็บทุก logs ในไฟล์
  new winston.transports.File({
    filename: path.join(__dirname, "../../logs/all.log"),
  }),
  // แสดง log ใน console
  new winston.transports.Console(),
];

// สร้าง logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  levels,
  format,
  transports,
});

export default logger;
