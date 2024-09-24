"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sparePartController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.sparePartController = {
    async createSparePart(req, res) {
        try {
            const { sku, name, detail, unit, lifespan, remainingLifespan, maintenanceInterval, installationDate, machineId, quantity, minimumQuantity, lastReplaced, } = req.body;
            const newSparePart = await prisma.sparePart.create({
                data: {
                    sku,
                    name,
                    detail,
                    unit,
                    lifespan,
                    remainingLifespan,
                    maintenanceInterval,
                    installationDate: installationDate
                        ? new Date(installationDate)
                        : null,
                    machine: { connect: { id: machineId } },
                    quantity,
                    minimumQuantity,
                    lastReplaced: lastReplaced ? new Date(lastReplaced) : null,
                },
            });
            res.status(201).json(newSparePart);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถสร้างอะไหล่ได้" });
        }
    },
    async getAllSpareParts(res) {
        try {
            const spareParts = await prisma.sparePart.findMany({
                include: { machine: true },
            });
            res.status(200).json(spareParts);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ได้" });
        }
    },
    async getSparePartById(req, res) {
        try {
            const { id } = req.params;
            const sparePart = await prisma.sparePart.findUnique({
                where: { id },
                include: { machine: true },
            });
            if (sparePart) {
                res.status(200).json(sparePart);
            }
            else {
                res.status(404).json({ error: "ไม่พบอะไหล่" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ได้" });
        }
    },
    async updateSparePart(req, res) {
        try {
            const { id } = req.params;
            const { sku, name, detail, unit, lifespan, remainingLifespan, maintenanceInterval, installationDate, machineId, quantity, minimumQuantity, lastReplaced, } = req.body;
            const updatedSparePart = await prisma.sparePart.update({
                where: { id },
                data: {
                    sku,
                    name,
                    detail,
                    unit,
                    lifespan,
                    remainingLifespan,
                    maintenanceInterval,
                    installationDate: installationDate
                        ? new Date(installationDate)
                        : null,
                    machine: machineId ? { connect: { id: machineId } } : undefined,
                    quantity,
                    minimumQuantity,
                    lastReplaced: lastReplaced ? new Date(lastReplaced) : null,
                },
            });
            res.status(200).json(updatedSparePart);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลอะไหล่ได้" });
        }
    },
    async deleteSparePart(req, res) {
        try {
            const { id } = req.params;
            await prisma.sparePart.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถลบอะไหล่ได้" });
        }
    },
    async getSparePartsByMachine(req, res) {
        try {
            const { machineId } = req.params;
            const spareParts = await prisma.sparePart.findMany({
                where: { machineId },
            });
            res.status(200).json(spareParts);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ตามเครื่องจักรได้" });
        }
    },
    async updateSparePartQuantity(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const updatedSparePart = await prisma.sparePart.update({
                where: { id },
                data: { quantity },
            });
            res.status(200).json(updatedSparePart);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถอัปเดตจำนวนอะไหล่ได้" });
        }
    },
    async getLowStockSpareParts(res) {
        try {
            const lowStockParts = await prisma.sparePart.findMany({
                where: {
                    quantity: { lte: prisma.sparePart.fields.minimumQuantity },
                },
                include: { machine: true },
            });
            res.status(200).json(lowStockParts);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ที่ต้องสั่งซื้อได้" });
        }
    },
    async recordSparePartReplacement(req, res) {
        try {
            const { id } = req.params;
            const { replacementDate } = req.body;
            const currentSparePart = await prisma.sparePart.findUnique({
                where: { id },
                select: { lifespan: true },
            });
            if (!currentSparePart) {
                res.status(404).json({ error: "ไม่พบอะไหล่" });
                return;
            }
            const updatedSparePart = await prisma.sparePart.update({
                where: { id },
                data: {
                    lastReplaced: new Date(replacementDate),
                    remainingLifespan: currentSparePart.lifespan,
                },
            });
            res.status(200).json(updatedSparePart);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถบันทึกการเปลี่ยนอะไหล่ได้" });
        }
    },
};
exports.default = exports.sparePartController;
//# sourceMappingURL=sparePartController.js.map