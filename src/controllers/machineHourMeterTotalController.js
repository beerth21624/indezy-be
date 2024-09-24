"use strict";
// src/controllers/machineHourMeterTotalController.ts
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
exports.machineHourMeterTotalController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.machineHourMeterTotalController = {
    // บันทึกข้อมูลชั่วโมงการทำงานใหม่
    createHourMeterTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId, normal, stop, risk, abnormal, date } = req.body;
                const newHourMeterTotal = yield prisma.machineHourMeterTotal.create({
                    data: {
                        machine: { connect: { id: machineId } },
                        normal,
                        stop,
                        risk,
                        abnormal,
                        total: normal + stop + risk + abnormal,
                        date: new Date(date),
                    },
                    include: {
                        machine: true,
                    },
                });
                res.status(201).json(newHourMeterTotal);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถบันทึกข้อมูลชั่วโมงการทำงานได้" });
            }
        });
    },
    // ดึงข้อมูลชั่วโมงการทำงานทั้งหมด
    getAllHourMeterTotals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hourMeterTotals = yield prisma.machineHourMeterTotal.findMany({
                    include: {
                        machine: true,
                    },
                });
                res.status(200).json(hourMeterTotals);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานได้" });
            }
        });
    },
    // ดึงข้อมูลชั่วโมงการทำงานตาม ID
    getHourMeterTotalById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const hourMeterTotal = yield prisma.machineHourMeterTotal.findUnique({
                    where: { id },
                    include: {
                        machine: true,
                    },
                });
                if (hourMeterTotal) {
                    res.status(200).json(hourMeterTotal);
                }
                else {
                    res.status(404).json({ error: "ไม่พบข้อมูลชั่วโมงการทำงาน" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานได้" });
            }
        });
    },
    // อัปเดตข้อมูลชั่วโมงการทำงาน
    updateHourMeterTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { normal, stop, risk, abnormal, date } = req.body;
                const updatedHourMeterTotal = yield prisma.machineHourMeterTotal.update({
                    where: { id },
                    data: {
                        normal,
                        stop,
                        risk,
                        abnormal,
                        total: normal + stop + risk + abnormal,
                        date: date ? new Date(date) : undefined,
                    },
                    include: {
                        machine: true,
                    },
                });
                res.status(200).json(updatedHourMeterTotal);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถอัปเดตข้อมูลชั่วโมงการทำงานได้" });
            }
        });
    },
    // ลบข้อมูลชั่วโมงการทำงาน
    deleteHourMeterTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const resault = yield prisma.machineHourMeterTotal.delete({
                    where: { id },
                });
                if (resault) {
                    res
                        .status(200)
                        .json({ message: "ลบข้อมูลชั่วโมงการทำงานเรียบร้อยแล้ว" });
                }
                else {
                    res.status(404).json({ error: "ไม่พบข้อมูลชั่วโมงการทำงาน" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถลบข้อมูลชั่วโมงการทำงานได้" });
            }
        });
    },
    // ดึงข้อมูลชั่วโมงการทำงานตามเครื่องจักร
    getHourMeterTotalsByMachine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId } = req.params;
                const hourMeterTotals = yield prisma.machineHourMeterTotal.findMany({
                    where: { machineId },
                    orderBy: { date: "desc" },
                });
                res.status(200).json(hourMeterTotals);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานตามเครื่องจักรได้" });
            }
        });
    },
    getHourMeterTotalsByMachines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineIds } = req.query;
                if (!machineIds || typeof machineIds !== 'string') {
                    res.status(400).json({ error: "Invalid machineIds parameter" });
                    return;
                }
                const machineIdArray = machineIds.split(',');
                const hourMeterTotals = yield prisma.machineHourMeterTotal.findMany({
                    where: {
                        machineId: {
                            in: machineIdArray
                        }
                    },
                    orderBy: { date: "desc" },
                    include: {
                        machine: true
                    }
                });
                // Calculate totals for all selected machines
                const totalSummary = hourMeterTotals.reduce((acc, curr) => {
                    acc.normal += curr.normal;
                    acc.stop += curr.stop;
                    acc.risk += curr.risk;
                    acc.abnormal += curr.abnormal;
                    acc.total += curr.total;
                    return acc;
                }, { normal: 0, stop: 0, risk: 0, abnormal: 0, total: 0 });
                res.status(200).json(totalSummary);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานตามเครื่องจักรที่เลือกได้" });
            }
        });
    },
    // ดึงข้อมูลชั่วโมงการทำงานตามช่วงเวลา
    getHourMeterTotalsByDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId } = req.params;
                const { startDate, endDate } = req.query;
                const hourMeterTotals = yield prisma.machineHourMeterTotal.findMany({
                    where: {
                        machineId,
                        date: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        },
                    },
                    orderBy: { date: "asc" },
                });
                res.status(200).json(hourMeterTotals);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานตามช่วงเวลาได้" });
            }
        });
    },
    // คำนวณสรุปชั่วโมงการทำงานรายเดือน
    calculateMonthlyHourMeterTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId, year, month } = req.params;
                const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                const endDate = new Date(parseInt(year), parseInt(month), 0);
                const hourMeterTotals = yield prisma.machineHourMeterTotal.findMany({
                    where: {
                        machineId,
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });
                const monthlySummary = hourMeterTotals.reduce((acc, curr) => {
                    acc.normal += curr.normal;
                    acc.stop += curr.stop;
                    acc.risk += curr.risk;
                    acc.abnormal += curr.abnormal;
                    acc.total += curr.total;
                    return acc;
                }, { normal: 0, stop: 0, risk: 0, abnormal: 0, total: 0 });
                res.status(200).json(monthlySummary);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถคำนวณสรุปชั่วโมงการทำงานรายเดือนได้" });
            }
        });
    },
    // ดึงข้อมูลชั่วโมงการทำงานล่าสุดของแต่ละเครื่อง
    getLatestHourMeterTotalForAllMachines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latestHourMeterTotals = yield prisma.machine.findMany({
                    include: {
                        hourMeterTotals: {
                            orderBy: { date: "desc" },
                            take: 1,
                        },
                    },
                });
                res.status(200).json(latestHourMeterTotals);
            }
            catch (error) {
                res.status(500).json({
                    error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานล่าสุดของแต่ละเครื่องได้",
                });
            }
        });
    },
};
exports.default = exports.machineHourMeterTotalController;
