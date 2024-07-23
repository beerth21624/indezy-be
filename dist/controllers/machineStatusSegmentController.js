"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineStatusSegmentController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.machineStatusSegmentController = {
    async createMachineStatusSegment(req, res) {
        try {
            const { machineId, group, status, description, startDatetime, endDatetime, } = req.body;
            const newStatusSegment = await prisma.machineStatusSegment.create({
                data: {
                    machine: { connect: { id: machineId } },
                    group,
                    status,
                    description,
                    startDatetime: new Date(startDatetime),
                    endDatetime: new Date(endDatetime),
                },
                include: {
                    machine: true,
                },
            });
            res.status(201).json(newStatusSegment);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถบันทึกสถานะเครื่องจักรได้" });
        }
    },
    async getAllMachineStatusSegments(res) {
        try {
            const statusSegments = await prisma.machineStatusSegment.findMany({
                include: {
                    machine: true,
                },
            });
            res.status(200).json(statusSegments);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
        }
    },
    async getMachineStatusSegmentById(req, res) {
        try {
            const { id } = req.params;
            const statusSegment = await prisma.machineStatusSegment.findUnique({
                where: { id },
                include: {
                    machine: true,
                },
            });
            if (statusSegment) {
                res.status(200).json(statusSegment);
            }
            else {
                res.status(404).json({ error: "ไม่พบข้อมูลสถานะเครื่องจักร" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
        }
    },
    async updateMachineStatusSegment(req, res) {
        try {
            const { id } = req.params;
            const { group, status, description, startDatetime, endDatetime } = req.body;
            const updatedStatusSegment = await prisma.machineStatusSegment.update({
                where: { id },
                data: {
                    group,
                    status,
                    description,
                    startDatetime: new Date(startDatetime),
                    endDatetime: new Date(endDatetime),
                },
                include: {
                    machine: true,
                },
            });
            res.status(200).json(updatedStatusSegment);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถอัปเดตข้อมูลสถานะเครื่องจักรได้" });
        }
    },
    async deleteMachineStatusSegment(req, res) {
        try {
            const { id } = req.params;
            await prisma.machineStatusSegment.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถลบข้อมูลสถานะเครื่องจักรได้" });
        }
    },
    async getStatusSegmentsByMachine(req, res) {
        try {
            const { machineId } = req.params;
            const statusSegments = await prisma.machineStatusSegment.findMany({
                where: { machineId },
                orderBy: { startDatetime: "desc" },
            });
            res.status(200).json(statusSegments);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรตามเครื่องจักรได้" });
        }
    },
    async getLatestStatusForAllMachines(res) {
        try {
            const latestStatuses = await prisma.machine.findMany({
                include: {
                    statusSegments: {
                        orderBy: { endDatetime: "desc" },
                        take: 1,
                    },
                },
            });
            res.status(200).json(latestStatuses);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลสถานะล่าสุดของเครื่องจักรได้" });
        }
    },
    async getStatusSegmentsByDateRange(req, res) {
        try {
            const { machineId } = req.params;
            const { startDate, endDate } = req.query;
            const statusSegments = await prisma.machineStatusSegment.findMany({
                where: {
                    machineId,
                    startDatetime: { gte: new Date(startDate) },
                    endDatetime: { lte: new Date(endDate) },
                },
                orderBy: { startDatetime: "asc" },
            });
            res.status(200).json(statusSegments);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรตามช่วงเวลาได้" });
        }
    },
    async calculateMachineUptime(req, res) {
        try {
            const { machineId } = req.params;
            const { startDate, endDate } = req.query;
            const statusSegments = await prisma.machineStatusSegment.findMany({
                where: {
                    machineId,
                    startDatetime: { gte: new Date(startDate) },
                    endDatetime: { lte: new Date(endDate) },
                },
            });
            const uptimeByStatus = statusSegments.reduce((acc, segment) => {
                const duration = segment.endDatetime.getTime() - segment.startDatetime.getTime();
                acc[segment.status] = (acc[segment.status] || 0) + duration;
                return acc;
            }, {});
            res.status(200).json(uptimeByStatus);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถคำนวณเวลาทำงานของเครื่องจักรได้" });
        }
    },
};
exports.default = exports.machineStatusSegmentController;
//# sourceMappingURL=machineStatusSegmentController.js.map