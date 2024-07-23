"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceTaskController = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.maintenanceTaskController = {
    async createMaintenanceTask(req, res) {
        try {
            const { machineId, task, description, dueDate, priority, assignedUserId, } = req.body;
            const newTask = await prisma.maintenanceTask.create({
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
    },
    async getAllMaintenanceTasks(res) {
        try {
            const tasks = await prisma.maintenanceTask.findMany({
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
    },
    async getMaintenanceTaskById(req, res) {
        try {
            const { id } = req.params;
            const task = await prisma.maintenanceTask.findUnique({
                where: { id },
                include: {
                    machine: true,
                    assignedTo: true,
                },
            });
            if (task) {
                res.status(200).json(task);
            }
            else {
                res.status(404).json({ error: "ไม่พบงานบำรุงรักษา" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาได้" });
        }
    },
    async updateMaintenanceTask(req, res) {
        try {
            const { id } = req.params;
            const { task, description, dueDate, status, priority, assignedUserId } = req.body;
            const updatedTask = await prisma.maintenanceTask.update({
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
    },
    async deleteMaintenanceTask(req, res) {
        try {
            const { id } = req.params;
            await prisma.maintenanceTask.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถลบงานบำรุงรักษาได้" });
        }
    },
    async getTasksByMachine(req, res) {
        try {
            const { machineId } = req.params;
            const tasks = await prisma.maintenanceTask.findMany({
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
    },
    async getTasksByAssignee(req, res) {
        try {
            const { userId } = req.params;
            const tasks = await prisma.maintenanceTask.findMany({
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
    },
    async updateTaskStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedTask = await prisma.maintenanceTask.update({
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
    },
    async getOverdueTasks(res) {
        try {
            const overdueTasks = await prisma.maintenanceTask.findMany({
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
    },
};
exports.default = exports.maintenanceTaskController;
//# sourceMappingURL=maintenanceTaskController.js.map