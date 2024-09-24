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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.userController = {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma.user.findMany({
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
                res.status(200).json(users);
            }
            catch (error) {
                console.error("Get users error:", error);
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
            }
        });
    },
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield prisma.user.findUnique({
                    where: { id },
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
                console.error("Get user by ID error:", error);
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
            }
        });
    },
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { firstName, lastName, email, role, status } = req.body;
                const updatedUser = yield prisma.user.update({
                    where: { id },
                    data: {
                        firstName,
                        lastName,
                        email,
                        role: role,
                        status: status,
                    },
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
                res.status(200).json(updatedUser);
            }
            catch (error) {
                console.error("Update user error:", error);
                res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้" });
            }
        });
    },
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma.user.delete({ where: { id } });
                res.status(200).json({ message: "ลบผู้ใช้สำเร็จ" });
            }
            catch (error) {
                console.error("Delete user error:", error);
                res.status(500).json({ error: "ไม่สามารถลบผู้ใช้ได้" });
            }
        });
    },
    updateUserRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { role } = req.body;
                const updatedUser = yield prisma.user.update({
                    where: { id },
                    data: { role: role },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                });
                res.status(200).json(updatedUser);
            }
            catch (error) {
                console.error("Update user role error:", error);
                res.status(500).json({ error: "ไม่สามารถอัปเดต role ของผู้ใช้ได้" });
            }
        });
    },
    assignUserToFactory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, factoryId } = req.body;
                const factory = yield prisma.factory.findUnique({
                    where: { id: factoryId },
                });
                if (!factory) {
                    res.status(404).json({ error: "ไม่พบโรงงาน" });
                    return;
                }
                const companyId = factory.companyId;
                const updatedUser = yield prisma.user.update({
                    where: { id: userId },
                    data: { factoryId, companyId },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        factory: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        company: {
                            select: {
                                id: true,
                                name: true,
                            },
                        }
                    },
                });
                res.status(200).json(updatedUser);
            }
            catch (error) {
                console.error("Assign user to factory error:", error);
                res.status(500).json({ error: "ไม่สามารถ assign ผู้ใช้ให้กับโรงงานได้" });
            }
        });
    },
    assignUserToCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, companyId } = req.body;
                const updatedUser = yield prisma.user.update({
                    where: { id: userId },
                    data: { companyId },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                });
                res.status(200).json(updatedUser);
            }
            catch (error) {
                console.error("Assign user to company error:", error);
                res.status(500).json({ error: "ไม่สามารถ assign ผู้ใช้ให้กับบริษัทได้" });
            }
        });
    },
    getUsersByFactory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // ... (โค้ดเดิม)
        });
    },
    getUsersByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId } = req.params;
                const users = yield prisma.user.findMany({
                    where: { companyId },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        status: true,
                    },
                });
                res.status(200).json(users);
            }
            catch (error) {
                console.error("Get users by company error:", error);
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ตามบริษัทได้" });
            }
        });
    },
};
exports.default = exports.userController;
