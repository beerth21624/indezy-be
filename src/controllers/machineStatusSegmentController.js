"use strict";
// src/controllers/machineStatusSegmentController.ts
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
exports.machineStatusSegmentController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.machineStatusSegmentController = {
    // บันทึกสถานะเครื่องจักรใหม่
    createMachineStatusSegment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId, group, status, description, startDatetime, endDatetime, } = req.body;
                if (!status) {
                    res.status(400).json({ error: "กรุณาระบุสถานะ" });
                    return;
                }
                const newStatusSegment = yield prisma.machineStatusSegment.create({
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
                yield prisma.machine.update({
                    where: { id: machineId },
                    data: {
                        currentStatus: status,
                    },
                });
                res.status(201).json(newStatusSegment);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถบันทึกสถานะเครื่องจักรได้" });
            }
        });
    },
    // ดึงข้อมูลสถานะเครื่องจักรทั้งหมด
    getAllMachineStatusSegments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statusSegments = yield prisma.machineStatusSegment.findMany({
                    include: {
                        machine: true,
                    },
                });
                res.status(200).json(statusSegments);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
            }
        });
    },
    // ดึงข้อมูลสถานะเครื่องจักรตาม ID
    getMachineStatusSegmentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const statusSegment = yield prisma.machineStatusSegment.findUnique({
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
        });
    },
    // อัปเดตข้อมูลสถานะเครื่องจักร
    updateMachineStatusSegment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { group, status, description, startDatetime, endDatetime } = req.body;
                const updatedStatusSegment = yield prisma.machineStatusSegment.update({
                    where: { id },
                    data: {
                        group,
                        status,
                        description,
                        startDatetime: startDatetime ? new Date(startDatetime) : undefined,
                        endDatetime: endDatetime ? new Date(endDatetime) : undefined,
                    },
                    include: {
                        machine: true,
                    },
                });
                res.status(200).json(updatedStatusSegment);
            }
            catch (error) {
                console.log("error", error);
                res
                    .status(500)
                    .json({ error: "ไม่สามารถอัปเดตข้อมูลสถานะเครื่องจักรได้" });
            }
        });
    },
    // ลบข้อมูลสถานะเครื่องจักร
    deleteMachineStatusSegment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield prisma.machineStatusSegment.delete({
                    where: { id },
                });
                if (result) {
                    res
                        .status(200)
                        .json({ message: "ลบข้อมูลสถานะเครื่องจักรเรียบร้อยแล้ว" });
                }
                else {
                    res.status(404).json({ error: "ไม่พบข้อมูลสถานะเครื่องจักร" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถลบข้อมูลสถานะเครื่องจักรได้" });
            }
        });
    },
    // ดึงข้อมูลสถานะเครื่องจักรตามเครื่องจักร
    getStatusSegmentsByMachine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId } = req.params;
                const statusSegments = yield prisma.machineStatusSegment.findMany({
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
        });
    },
    // ดึงข้อมูลสถานะเครื่องจักรล่าสุดของแต่ละเครื่อง
    getLatestStatusForAllMachines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latestStatuses = yield prisma.machine.findMany({
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
        });
    },
    // ดึงข้อมูลสถานะเครื่องจักรตามช่วงเวลา
    getStatusSegmentsByDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId } = req.params;
                const { startDate, endDate } = req.query;
                const statusSegments = yield prisma.machineStatusSegment.findMany({
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
        });
    },
    // คำนวณเวลาทำงานของเครื่องจักรตามสถานะ
    calculateMachineUptime(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId } = req.params;
                const { startDate, endDate } = req.query;
                const statusSegments = yield prisma.machineStatusSegment.findMany({
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
        });
    },
    getMachineStatusDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineIds, startDate, endDate } = req.query;
                if (!machineIds || typeof machineIds !== "string") {
                    res.status(400).json({ error: "Invalid machineIds parameter" });
                    return;
                }
                const machineIdArray = machineIds.split(",");
                const start = startDate
                    ? new Date(startDate)
                    : new Date(new Date().setHours(0, 0, 0, 0));
                const end = endDate ? new Date(endDate) : new Date();
                const statusDetails = yield prisma.machineStatusSegment.findMany({
                    where: {
                        machineId: { in: machineIdArray },
                        startDatetime: { gte: start },
                        endDatetime: { lte: end },
                    },
                    orderBy: [{ machineId: "asc" }, { startDatetime: "asc" }],
                    include: {
                        machine: {
                            select: { name: true },
                        },
                    },
                });
                const formattedDetails = statusDetails.map((detail) => ({
                    date: detail.startDatetime.toISOString().split("T")[0],
                    machineName: detail.machine.name,
                    time: `${detail.startDatetime
                        .toTimeString()
                        .slice(0, 5)} - ${detail.endDatetime.toTimeString().slice(0, 5)}`,
                    status: detail.description, // Using 'description' to represent status or issue
                }));
                res.status(200).json(formattedDetails);
            }
            catch (error) {
                console.error("Error in getMachineStatusDetails", error);
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
            }
        });
    },
    getSingleMachineStatusDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId } = req.params;
                const { startDate, endDate } = req.query;
                if (!machineId) {
                    res.status(400).json({ error: "Invalid machineId parameter" });
                    return;
                }
                const start = startDate
                    ? new Date(startDate)
                    : new Date(new Date().setHours(0, 0, 0, 0));
                const end = endDate ? new Date(endDate) : new Date();
                const statusDetails = yield prisma.machineStatusSegment.findMany({
                    where: {
                        machineId: machineId,
                        startDatetime: { gte: start },
                        endDatetime: { lte: end },
                    },
                    orderBy: [{ startDatetime: "asc" }],
                    include: {
                        machine: {
                            select: { name: true },
                        },
                    },
                });
                const formattedDetails = statusDetails.map((detail) => ({
                    date: detail.startDatetime.toISOString().split("T")[0],
                    machineName: detail.machine.name,
                    time: `${detail.startDatetime
                        .toTimeString()
                        .slice(0, 5)} - ${detail.endDatetime.toTimeString().slice(0, 5)}`,
                    status: detail.description,
                }));
                res.status(200).json(formattedDetails);
            }
            catch (error) {
                console.error("Error in getSingleMachineStatusDetails", error);
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
            }
        });
    },
};
exports.default = exports.machineStatusSegmentController;
