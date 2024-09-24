"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActive = exports.isAdmin = exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "ไม่พบ token การเข้าถึง" });
        return;
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: "token ไม่ถูกต้องหรือหมดอายุ" });
        }
        else {
            req.user = decoded;
            next();
        }
    });
};
exports.authenticateToken = authenticateToken;
const authorizeRoles = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
            return;
        }
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.userId },
            });
            if (!user || !roles.includes(user.role)) {
                res.status(403).json({ error: "ไม่มีสิทธิ์เข้าถึงส่วนนี้" });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์" });
        }
    };
};
exports.authorizeRoles = authorizeRoles;
const isAdmin = async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        if (!user || user.role !== client_1.UserRole.ADMIN) {
            res.status(403).json({ error: "ต้องเป็นผู้ดูแลระบบเท่านั้น" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Admin check error:", error);
        res
            .status(500)
            .json({ error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ผู้ดูแลระบบ" });
    }
};
exports.isAdmin = isAdmin;
const isActive = async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        if (!user || user.status !== "ACTIVE") {
            res.status(403).json({ error: "บัญชีผู้ใช้ไม่ได้เปิดใช้งาน" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Active status check error:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบสถานะบัญชี" });
    }
};
exports.isActive = isActive;
//# sourceMappingURL=authMiddleware.js.map