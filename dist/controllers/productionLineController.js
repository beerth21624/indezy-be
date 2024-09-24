"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionLineController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.productionLineController = {
    async createProductionLine(req, res) {
        try {
            const { name, factoryId } = req.body;
            const newProductionLine = await prisma.productionLine.create({
                data: {
                    name,
                    factory: { connect: { id: factoryId } },
                },
            });
            res.status(201).json(newProductionLine);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถสร้างสายการผลิตได้" });
        }
    },
    async getAllProductionLines(res) {
        try {
            const productionLines = await prisma.productionLine.findMany({
                include: { factory: true },
            });
            res.status(200).json(productionLines);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตได้" });
        }
    },
    async getProductionLineById(req, res) {
        try {
            const { id } = req.params;
            const productionLine = await prisma.productionLine.findUnique({
                where: { id },
                include: {
                    factory: true,
                    machines: true,
                },
            });
            if (productionLine) {
                res.status(200).json(productionLine);
            }
            else {
                res.status(404).json({ error: "ไม่พบสายการผลิต" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตได้" });
        }
    },
    async updateProductionLine(req, res) {
        try {
            const { id } = req.params;
            const { name, factoryId } = req.body;
            const updatedProductionLine = await prisma.productionLine.update({
                where: { id },
                data: {
                    name,
                    factory: factoryId ? { connect: { id: factoryId } } : undefined,
                },
            });
            res.status(200).json(updatedProductionLine);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลสายการผลิตได้" });
        }
    },
    async deleteProductionLine(req, res) {
        try {
            const { id } = req.params;
            const resault = await prisma.productionLine.delete({
                where: { id },
            });
            if (resault) {
                res.status(200).json({ message: "ลบสายการผลิตสำเร็จ" });
            }
            else {
                res.status(404).json({ error: "ไม่พบสายการผลิต" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถลบสายการผลิตได้" });
        }
    },
    async getProductionLineMachines(req, res) {
        try {
            const { id } = req.params;
            const machines = await prisma.machine.findMany({
                where: { productionLineId: id },
            });
            res.status(200).json(machines);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลเครื่องจักรของสายการผลิตได้" });
        }
    },
    async getProductionLinesByFactory(req, res) {
        try {
            const { factoryId } = req.params;
            const productionLines = await prisma.productionLine.findMany({
                where: { factoryId },
                include: { machines: true },
            });
            res.status(200).json(productionLines);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตตามโรงงานได้" });
        }
    },
};
exports.default = exports.productionLineController;
//# sourceMappingURL=productionLineController.js.map