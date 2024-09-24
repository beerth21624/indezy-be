"use strict";
// src/controllers/maintenanceTaskController.ts
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
exports.maintenanceTaskController = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.maintenanceTaskController = {
    // สร้างงานบำรุงรักษาใหม่
    createMaintenanceTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId, task, description, dueDate, priority, assignedUserId, } = req.body;
                const newTask = yield prisma.maintenanceTask.create({
                    data: {
                        machine: { connect: { id: machineId } },
                        task,
                        description,
                        dueDate: new Date(dueDate),
                        status: client_2.TaskStatus.PENDING,
                        priority: priority,
                        assignedTo: { connect: { id: assignedUserId } },
                    },
                    include: {
                        machine: true,
                        assignedTo: true,
                    },
                });
                res.status(201).json(newTask);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถสร้างงานบำรุงรักษาได้" });
            }
        });
    },
    // ดึงข้อมูลงานบำรุงรักษาทั้งหมด
    getAllMaintenanceTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield prisma.maintenanceTask.findMany({
                    include: {
                        machine: true,
                        assignedTo: true,
                    },
                });
                res.status(200).json(tasks);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาได้" });
            }
        });
    },
    // ดึงข้อมูลงานบำรุงรักษาตาม ID
    getMaintenanceTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const task = yield prisma.maintenanceTask.findUnique({
                    where: { id },
                    include: {
                        machine: true,
                        assignedTo: true,
                    },
                });
                if (!task) {
                    res.status(200).json([]);
                    return;
                }
                res.status(200).json(task);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาได้" });
            }
        });
    },
    // อัปเดตข้อมูลงานบำรุงรักษา
    updateMaintenanceTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { task, description, dueDate, status, priority, assignedUserId } = req.body;
                const updatedTask = yield prisma.maintenanceTask.update({
                    where: { id },
                    data: {
                        task,
                        description,
                        dueDate: new Date(dueDate),
                        status: status,
                        priority: priority,
                        assignedTo: assignedUserId
                            ? { connect: { id: assignedUserId } }
                            : undefined,
                    },
                    include: {
                        machine: true,
                        assignedTo: true,
                    },
                });
                res.status(200).json(updatedTask);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลงานบำรุงรักษาได้" });
            }
        });
    },
    // ลบงานบำรุงรักษา
    deleteMaintenanceTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield prisma.maintenanceTask.delete({
                    where: { id },
                });
                if (result) {
                    res.status(200).json({ message: "ลบงานบำรุงรักษาเรียบร้อยแล้ว" });
                }
                else {
                    res.status(404).json({ error: "ไม่พบงานบำรุงรักษา" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถลบงานบำรุงรักษาได้" });
            }
        });
    },
    // ดึงงานบำรุงรักษาตามเครื่องจักร
    getTasksByMachine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId } = req.params;
                const tasks = yield prisma.maintenanceTask.findMany({
                    where: { machineId },
                    include: {
                        assignedTo: true,
                    },
                });
                res.status(200).json(tasks);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาตามเครื่องจักรได้" });
            }
        });
    },
    // ดึงงานบำรุงรักษาตามผู้รับผิดชอบ
    getTasksByAssignee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const tasks = yield prisma.maintenanceTask.findMany({
                    where: { assignedUserId: userId },
                    include: {
                        machine: true,
                    },
                });
                res.status(200).json(tasks);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาตามผู้รับผิดชอบได้" });
            }
        });
    },
    // อัปเดตสถานะงานบำรุงรักษา
    updateTaskStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const updatedTask = yield prisma.maintenanceTask.update({
                    where: { id },
                    data: {
                        status: status,
                        completedAt: status === client_2.TaskStatus.COMPLETED ? new Date() : null,
                    },
                    include: {
                        machine: true,
                        assignedTo: true,
                    },
                });
                res.status(200).json(updatedTask);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถอัปเดตสถานะงานบำรุงรักษาได้" });
            }
        });
    },
    // ดึงงานบำรุงรักษาที่เกินกำหนด
    getOverdueTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const overdueTasks = yield prisma.maintenanceTask.findMany({
                    where: {
                        dueDate: { lt: new Date() },
                        status: { not: client_2.TaskStatus.COMPLETED },
                    },
                    include: {
                        machine: true,
                        assignedTo: true,
                    },
                });
                res.status(200).json(overdueTasks);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาที่เกินกำหนดได้" });
            }
        });
    },
};
exports.default = exports.maintenanceTaskController;
