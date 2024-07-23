"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.machineController = {
    async createMachine(req, res) {
        try {
            const { name, type, installationDate, productionLineId } = req.body;
            const newMachine = await prisma.machine.create({
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
    },
    async getAllMachines(res) {
        try {
            const machines = await prisma.machine.findMany({
                include: { productionLine: true },
            });
            res.status(200).json(machines);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลเครื่องจักรได้" });
        }
    },
    async getMachineById(req, res) {
        try {
            const { id } = req.params;
            const machine = await prisma.machine.findUnique({
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
    },
    async getMachineWithStatus(req, res) {
        var _a;
        try {
            const { company_id, factory_id, productionLine_id } = req.params;
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
            const machines = await prisma.machine.findMany({
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
    },
    async updateMachine(req, res) {
        try {
            const { id } = req.params;
            const { name, type, installationDate, productionLineId } = req.body;
            const updatedMachine = await prisma.machine.update({
                where: { id },
                data: {
                    name,
                    type,
                    installationDate: new Date(installationDate),
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
    },
    async deleteMachine(req, res) {
        try {
            const { id } = req.params;
            const resault = await prisma.machine.delete({
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
    },
    async getMachineLatestStatus(res) {
        try {
            const machines = await prisma.machine.findMany({
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
    },
    async getMachineLatestHourMeter(req, res) {
        try {
            const { id } = req.params;
            const latestHourMeter = await prisma.machineHourMeterTotal.findFirst({
                where: { machineId: id },
                orderBy: { date: "desc" },
            });
            res.status(200).json(latestHourMeter);
        }
        catch (error) {
            res
                .status(500)
                .json({
                error: "ไม่สามารถดึงข้อมูล Hour Meter ล่าสุดของเครื่องจักรได้",
            });
        }
    },
    async getMachineLatestPowerMetric(req, res) {
        try {
            const { id } = req.params;
            const latestPowerMetric = await prisma.powerMetric.findFirst({
                where: { machineId: id },
                orderBy: { timestamp: "desc" },
            });
            res.status(200).json(latestPowerMetric);
        }
        catch (error) {
            res
                .status(500)
                .json({
                error: "ไม่สามารถดึงข้อมูล Power Metric ล่าสุดของเครื่องจักรได้",
            });
        }
    },
    async getMachineMaintenanceTasks(req, res) {
        try {
            const { id } = req.params;
            const maintenanceTasks = await prisma.maintenanceTask.findMany({
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
    },
    async getMachineSpareParts(req, res) {
        try {
            const { id } = req.params;
            const spareParts = await prisma.sparePart.findMany({
                where: { machineId: id },
            });
            res.status(200).json(spareParts);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ของเครื่องจักรได้" });
        }
    },
};
function calculateEfficiency(hourMeter) {
    if (!hourMeter)
        return 0;
    const totalHours = hourMeter.normal + hourMeter.stop + hourMeter.risk + hourMeter.abnormal;
    return totalHours > 0 ? Math.round((hourMeter.normal / totalHours) * 100) : 0;
}
exports.default = exports.machineController;
//# sourceMappingURL=machineController.js.map