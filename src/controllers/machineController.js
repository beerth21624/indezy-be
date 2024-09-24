"use strict";
// src/controllers/machineController.ts
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
exports.machineController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.machineController = {
    // สร้างเครื่องจักรใหม่
    createMachine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, type, installationDate, productionLineId } = req.body;
                const newMachine = yield prisma.machine.create({
                    data: {
                        name,
                        type,
                        installationDate: new Date(installationDate),
                        productionLine: { connect: { id: productionLineId } },
                    },
                });
                res.status(201).json(newMachine);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถสร้างเครื่องจักรได้" });
            }
        });
    },
    // ดึงข้อมูลเครื่องจักรทั้งหมด
    getAllMachines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const machines = yield prisma.machine.findMany({
                    include: { productionLine: true },
                });
                res.status(200).json(machines);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลเครื่องจักรได้" });
            }
        });
    },
    // ดึงข้อมูลเครื่องจักรตาม ID
    getMachineById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const machine = yield prisma.machine.findUnique({
                    where: { id },
                    include: {
                        productionLine: true,
                        maintenanceTasks: true,
                        spareParts: true,
                        statusSegments: true,
                        hourMeterTotals: true,
                        powerMetrics: true,
                    },
                });
                if (machine) {
                    res.status(200).json(machine);
                }
                else {
                    res.status(404).json({ error: "ไม่พบเครื่องจักร" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลเครื่องจักรได้" });
            }
        });
    },
    getMachineWithStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { company_id, factory_id, productionLine_id } = req.params;
                // Build the where clause dynamically based on provided parameters
                const whereClause = {};
                if (company_id) {
                    whereClause.productionLine = { factory: { companyId: company_id } };
                }
                if (factory_id) {
                    whereClause.productionLine = Object.assign(Object.assign({}, whereClause.productionLine), { factory: Object.assign(Object.assign({}, (_a = whereClause.productionLine) === null || _a === void 0 ? void 0 : _a.factory), { id: factory_id }) });
                }
                if (productionLine_id) {
                    whereClause.productionLine = Object.assign(Object.assign({}, whereClause.productionLine), { id: productionLine_id });
                }
                const machines = yield prisma.machine.findMany({
                    where: whereClause,
                    include: {
                        statusSegments: {
                            orderBy: { endDatetime: "desc" },
                            take: 1,
                        },
                        hourMeterTotals: {
                            orderBy: { date: "desc" },
                            take: 1,
                        },
                    },
                });
                console.log("machine", machines);
                const machineStatuses = machines.map((machine) => {
                    var _a, _b, _c;
                    return ({
                        id: machine.id,
                        name: machine.name,
                        status: ((_a = machine.statusSegments[0]) === null || _a === void 0 ? void 0 : _a.status) || "Unknown",
                        normal: ((_b = machine.hourMeterTotals[0]) === null || _b === void 0 ? void 0 : _b.normal) || 0,
                        risk: ((_c = machine.hourMeterTotals[0]) === null || _c === void 0 ? void 0 : _c.risk) || 0,
                        efficiency: calculateEfficiency(machine.hourMeterTotals[0]),
                    });
                });
                res.status(200).json(machineStatuses);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลสถานะล่าสุดของเครื่องจักรได้" });
            }
        });
    },
    // อัปเดตข้อมูลเครื่องจักร
    updateMachine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, type, installationDate, productionLineId } = req.body;
                const updatedMachine = yield prisma.machine.update({
                    where: { id },
                    data: {
                        name,
                        type,
                        installationDate: installationDate ? new Date(installationDate) : undefined,
                        productionLine: productionLineId
                            ? { connect: { id: productionLineId } }
                            : undefined,
                    },
                });
                res.status(200).json(updatedMachine);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลเครื่องจักรได้" });
            }
        });
    },
    // ลบเครื่องจักร
    deleteMachine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const resault = yield prisma.machine.delete({
                    where: { id },
                });
                if (resault) {
                    res.status(200).json({ message: "ลบเครื่องจักรสำเร็จ" });
                }
                else {
                    res.status(404).json({ error: "ไม่พบเครื่องจักร" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถลบเครื่องจักรได้" });
            }
        });
    },
    // ดึงข้อมูลสถานะล่าสุดของเครื่องจักร
    getMachineLatestStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const machines = yield prisma.machine.findMany({
                    include: {
                        statusSegments: {
                            orderBy: { endDatetime: "desc" },
                            take: 1,
                        },
                        hourMeterTotals: {
                            orderBy: { date: "desc" },
                            take: 1,
                        },
                    },
                });
                const machineStatuses = machines.map((machine) => {
                    var _a, _b, _c;
                    return ({
                        id: machine.id,
                        name: machine.name,
                        status: ((_a = machine.statusSegments[0]) === null || _a === void 0 ? void 0 : _a.status) || "Unknown",
                        normal: ((_b = machine.hourMeterTotals[0]) === null || _b === void 0 ? void 0 : _b.normal) || 0,
                        risk: ((_c = machine.hourMeterTotals[0]) === null || _c === void 0 ? void 0 : _c.risk) || 0,
                        efficiency: calculateEfficiency(machine.hourMeterTotals[0]),
                    });
                });
                res.status(200).json(machineStatuses);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลสถานะล่าสุดของเครื่องจักรได้" });
            }
        });
    },
    // ดึงข้อมูล Hour Meter ล่าสุดของเครื่องจักร
    getMachineLatestHourMeter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const latestHourMeter = yield prisma.machineHourMeterTotal.findFirst({
                    where: { machineId: id },
                    orderBy: { date: "desc" },
                });
                res.status(200).json(latestHourMeter);
            }
            catch (error) {
                res.status(500).json({
                    error: "ไม่สามารถดึงข้อมูล Hour Meter ล่าสุดของเครื่องจักรได้",
                });
            }
        });
    },
    // ดึงข้อมูล Power Metric ล่าสุดของเครื่องจักร
    getMachineLatestPowerMetric(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const latestPowerMetric = yield prisma.powerMetric.findFirst({
                    where: { machineId: id },
                    orderBy: { timestamp: "desc" },
                });
                res.status(200).json(latestPowerMetric);
            }
            catch (error) {
                res.status(500).json({
                    error: "ไม่สามารถดึงข้อมูล Power Metric ล่าสุดของเครื่องจักรได้",
                });
            }
        });
    },
    // ดึงข้อมูลงานบำรุงรักษาของเครื่องจักร
    getMachineMaintenanceTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const maintenanceTasks = yield prisma.maintenanceTask.findMany({
                    where: { machineId: id },
                    include: { assignedTo: true },
                });
                res.status(200).json(maintenanceTasks);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาของเครื่องจักรได้" });
            }
        });
    },
    // ดึงข้อมูลอะไหล่ของเครื่องจักร
    getMachineSpareParts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const spareParts = yield prisma.sparePart.findMany({
                    where: { machineId: id },
                });
                res.status(200).json(spareParts);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ของเครื่องจักรได้" });
            }
        });
    },
};
function calculateEfficiency(hourMeter) {
    if (!hourMeter)
        return 0;
    const totalHours = hourMeter.normal + hourMeter.stop + hourMeter.risk + hourMeter.abnormal;
    return totalHours > 0 ? Math.round((hourMeter.normal / totalHours) * 100) : 0;
}
exports.default = exports.machineController;
