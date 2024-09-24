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
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
            return;
        }
        try {
            const user = yield prisma.user.findUnique({
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
    });
};
exports.authorizeRoles = authorizeRoles;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
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
});
exports.isAdmin = isAdmin;
const isActive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
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
});
exports.isActive = isActive;
// ตัวอย่างการใช้งาน
// router.get('/protected', authenticateToken, (req, res) => {
// เฉพาะผู้ใช้ที่เข้าสู่ระบบแล้วเท่านั้นที่สามารถเข้าถึงได้
// });
// router.get('/managers-only', authenticateToken, authorizeRoles([UserRole.MANAGER]), (req, res) => {
// เฉพาะผู้จัดการเท่านั้นที่สามารถเข้าถึงได้
// });
// router.get('/admin-dashboard', authenticateToken, isAdmin, (req, res) => {
// เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าถึงได้
// });
// router.post('/user-action', authenticateToken, isActive, (req, res) => {
// เฉพาะบัญชีที่เปิดใช้งานเท่านั้นที่สามารถดำเนินการได้
// });
