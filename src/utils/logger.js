"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
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
winston_1.default.addColors(colors);
// กำหนดรูปแบบของ log
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// กำหนด transports (วิธีการเก็บ log)
const transports = [
    // เก็บ error logs ในไฟล์
    new winston_1.default.transports.File({
        filename: path_1.default.join(__dirname, "../../logs/error.log"),
        level: "error",
    }),
    // เก็บทุก logs ในไฟล์
    new winston_1.default.transports.File({
        filename: path_1.default.join(__dirname, "../../logs/all.log"),
    }),
    // แสดง log ใน console
    new winston_1.default.transports.Console(),
];
// สร้าง logger
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "development" ? "debug" : "warn",
    levels,
    format,
    transports,
});
exports.default = logger;
