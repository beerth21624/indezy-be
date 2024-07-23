"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.powerMetricController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.powerMetricController = {
    async createPowerMetric(req, res) {
        try {
            const { machineId, currentAvg, voltageV31, activePowerW3, powerFactorPf2, currentDemandDa1, voltageAverageVll, activePowerT, powerFactorPf3, currentDemandDa2, voltageV1n, reactivePowerVar1, powerFactorT, currentDemandDa3, voltageV2n, reactivePowerVar2, frequencyHz, currentA1, currentDemandDan, voltageV3n, reactivePowerVar3, harmonicCurrentHiT, currentA2, currentDemandDavg, voltageAverageVln, reactivePowerT, harmonicVoltageHvT, currentA3, voltageV12, activePowerW1, powerFactorPf1, currentAn, voltageV23, activePowerW2, } = req.body;
            const newPowerMetric = await prisma.powerMetric.create({
                data: {
                    machine: { connect: { id: machineId } },
                    currentAvg,
                    voltageV31,
                    activePowerW3,
                    powerFactorPf2,
                    currentDemandDa1,
                    voltageAverageVll,
                    activePowerT,
                    powerFactorPf3,
                    currentDemandDa2,
                    voltageV1n,
                    reactivePowerVar1,
                    powerFactorT,
                    currentDemandDa3,
                    voltageV2n,
                    reactivePowerVar2,
                    frequencyHz,
                    currentA1,
                    currentDemandDan,
                    voltageV3n,
                    reactivePowerVar3,
                    harmonicCurrentHiT,
                    currentA2,
                    currentDemandDavg,
                    voltageAverageVln,
                    reactivePowerT,
                    harmonicVoltageHvT,
                    currentA3,
                    voltageV12,
                    activePowerW1,
                    powerFactorPf1,
                    currentAn,
                    voltageV23,
                    activePowerW2,
                    timestamp: new Date(),
                },
                include: { machine: true },
            });
            res.status(201).json(newPowerMetric);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถบันทึกข้อมูล Power Metric ได้" });
        }
    },
    async getAllPowerMetrics(res) {
        try {
            const powerMetrics = await prisma.powerMetric.findMany({
                include: { machine: true },
            });
            res.status(200).json(powerMetrics);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูล Power Metric ได้" });
        }
    },
    async getPowerMetricById(req, res) {
        try {
            const { id } = req.params;
            const powerMetric = await prisma.powerMetric.findUnique({
                where: { id },
                include: { machine: true },
            });
            if (powerMetric) {
                res.status(200).json(powerMetric);
            }
            else {
                res.status(404).json({ error: "ไม่พบข้อมูล Power Metric" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูล Power Metric ได้" });
        }
    },
    async updatePowerMetric(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedPowerMetric = await prisma.powerMetric.update({
                where: { id },
                data: updateData,
                include: { machine: true },
            });
            res.status(200).json(updatedPowerMetric);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูล Power Metric ได้" });
        }
    },
    async deletePowerMetric(req, res) {
        try {
            const { id } = req.params;
            await prisma.powerMetric.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถลบข้อมูล Power Metric ได้" });
        }
    },
    async getPowerMetricsByMachine(req, res) {
        try {
            const { machineId } = req.params;
            const powerMetrics = await prisma.powerMetric.findMany({
                where: { machineId },
                orderBy: { timestamp: "desc" },
            });
            res.status(200).json(powerMetrics);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูล Power Metric ตามเครื่องจักรได้" });
        }
    },
    async getPowerMetricsByDateRange(req, res) {
        try {
            const { machineId } = req.params;
            const { startDate, endDate } = req.query;
            const powerMetrics = await prisma.powerMetric.findMany({
                where: {
                    machineId,
                    timestamp: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: { timestamp: "asc" },
            });
            res.status(200).json(powerMetrics);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูล Power Metric ตามช่วงเวลาได้" });
        }
    },
    async calculateDailyPowerConsumption(req, res) {
        try {
            const { machineId, date } = req.params;
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            const powerMetrics = await prisma.powerMetric.findMany({
                where: {
                    machineId,
                    timestamp: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });
            const dailySummary = powerMetrics.reduce((acc, curr) => {
                acc.totalActivePower += curr.activePowerT;
                acc.totalReactivePower += curr.reactivePowerT;
                acc.count++;
                return acc;
            }, { totalActivePower: 0, totalReactivePower: 0, count: 0 });
            const averageActivePower = dailySummary.totalActivePower / dailySummary.count;
            const averageReactivePower = dailySummary.totalReactivePower / dailySummary.count;
            res.status(200).json({
                date,
                averageActivePower,
                averageReactivePower,
                totalReadings: dailySummary.count,
            });
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถคำนวณสรุปการใช้พลังงานรายวันได้" });
        }
    },
    async getLatestPowerMetricForAllMachines(res) {
        try {
            const latestPowerMetrics = await prisma.machine.findMany({
                include: {
                    powerMetrics: {
                        orderBy: { timestamp: "desc" },
                        take: 1,
                    },
                },
            });
            res.status(200).json(latestPowerMetrics);
        }
        catch (error) {
            res
                .status(500)
                .json({
                error: "ไม่สามารถดึงข้อมูล Power Metric ล่าสุดของแต่ละเครื่องได้",
            });
        }
    },
};
exports.default = exports.powerMetricController;
//# sourceMappingURL=powerMetricController.js.map