"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineHourMeterTotalController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.machineHourMeterTotalController = {
    async createHourMeterTotal(req, res) {
        try {
            const { machineId, normal, stop, risk, abnormal, date } = req.body;
            const newHourMeterTotal = await prisma.machineHourMeterTotal.create({
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
    },
    async getAllHourMeterTotals(res) {
        try {
            const hourMeterTotals = await prisma.machineHourMeterTotal.findMany({
                include: {
                    machine: true,
                },
            });
            res.status(200).json(hourMeterTotals);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานได้" });
        }
    },
    async getHourMeterTotalById(req, res) {
        try {
            const { id } = req.params;
            const hourMeterTotal = await prisma.machineHourMeterTotal.findUnique({
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
    },
    async updateHourMeterTotal(req, res) {
        try {
            const { id } = req.params;
            const { normal, stop, risk, abnormal, date } = req.body;
            const updatedHourMeterTotal = await prisma.machineHourMeterTotal.update({
                where: { id },
                data: {
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
            res.status(200).json(updatedHourMeterTotal);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถอัปเดตข้อมูลชั่วโมงการทำงานได้" });
        }
    },
    async deleteHourMeterTotal(req, res) {
        try {
            const { id } = req.params;
            await prisma.machineHourMeterTotal.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถลบข้อมูลชั่วโมงการทำงานได้" });
        }
    },
    async getHourMeterTotalsByMachine(req, res) {
        try {
            const { machineId } = req.params;
            const hourMeterTotals = await prisma.machineHourMeterTotal.findMany({
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
    },
    async getHourMeterTotalsByDateRange(req, res) {
        try {
            const { machineId } = req.params;
            const { startDate, endDate } = req.query;
            const hourMeterTotals = await prisma.machineHourMeterTotal.findMany({
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
    },
    async calculateMonthlyHourMeterTotal(req, res) {
        try {
            const { machineId, year, month } = req.params;
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            const hourMeterTotals = await prisma.machineHourMeterTotal.findMany({
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
    },
    async getLatestHourMeterTotalForAllMachines(res) {
        try {
            const latestHourMeterTotals = await prisma.machine.findMany({
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
            res
                .status(500)
                .json({
                error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานล่าสุดของแต่ละเครื่องได้",
            });
        }
    },
};
exports.default = exports.machineHourMeterTotalController;
//# sourceMappingURL=machineHourMeterTotalController.js.map