"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
exports.authController = {
    async register(req, res) {
        try {
            const { username, email, password, firstName, lastName, role } = req.body;
            const existingUser = await prisma.user.findFirst({
                where: { OR: [{ username }, { email }] },
            });
            if (existingUser) {
                res
                    .status(400)
                    .json({ error: "ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว" });
                return;
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    role: role,
                    status: client_1.UserStatus.ACTIVE,
                },
            });
            const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, JWT_SECRET, {
                expiresIn: "1d",
            });
            const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
            res.status(201).json({ user: userWithoutPassword, token });
        }
        catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ error: "ไม่สามารถลงทะเบียนผู้ใช้ได้" });
        }
    },
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await prisma.user.findUnique({ where: { username } });
            if (!user) {
                res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
                return;
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
                expiresIn: "1d",
            });
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
            });
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            res.status(200).json({ user: userWithoutPassword, token });
        }
        catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "ไม่สามารถเข้าสู่ระบบได้" });
        }
    },
    async changePassword(req, res) {
        try {
            const { userId } = req.user;
            const { currentPassword, newPassword } = req.body;
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ error: "ไม่พบผู้ใช้" });
                return;
            }
            const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
                return;
            }
            const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword },
            });
            res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
        }
        catch (error) {
            console.error("Change password error:", error);
            res.status(500).json({ error: "ไม่สามารถเปลี่ยนรหัสผ่านได้" });
        }
    },
    async getCurrentUser(req, res) {
        try {
            const { userId } = req.user;
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!user) {
                res.status(404).json({ error: "ไม่พบผู้ใช้" });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            console.error("Get current user error:", error);
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
        }
    },
    async logout(res) {
        res.status(200).json({ message: "ออกจากระบบสำเร็จ" });
    },
};
exports.default = exports.authController;
//# sourceMappingURL=authController.js.map