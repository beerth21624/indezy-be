"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factoryController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.factoryController = {
    async createFactory(req, res) {
        try {
            const { name, companyId } = req.body;
            const newFactory = await prisma.factory.create({
                data: {
                    name,
                    company: { connect: { id: companyId } },
                },
            });
            res.status(201).json(newFactory);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถสร้างโรงงานได้" });
        }
    },
    async getAllFactories(res) {
        try {
            const factories = await prisma.factory.findMany({
                include: { company: true },
            });
            res.status(200).json(factories);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลโรงงานได้" });
        }
    },
    async getFactoryById(req, res) {
        try {
            const { id } = req.params;
            const factory = await prisma.factory.findUnique({
                where: { id },
                include: {
                    company: true,
                    lines: true,
                },
            });
            if (factory) {
                res.status(200).json(factory);
            }
            else {
                res.status(404).json({ error: "ไม่พบโรงงาน" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลโรงงานได้" });
        }
    },
    async updateFactory(req, res) {
        try {
            const { id } = req.params;
            const { name, companyId } = req.body;
            const updatedFactory = await prisma.factory.update({
                where: { id },
                data: {
                    name,
                    company: companyId ? { connect: { id: companyId } } : undefined,
                },
            });
            res.status(200).json(updatedFactory);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลโรงงานได้" });
        }
    },
    async deleteFactory(req, res) {
        try {
            const { id } = req.params;
            await prisma.factory.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถลบโรงงานได้" });
        }
    },
    async getFactoryProductionLines(req, res) {
        try {
            const { id } = req.params;
            const productionLines = await prisma.productionLine.findMany({
                where: { factoryId: id },
            });
            res.status(200).json(productionLines);
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตของโรงงานได้" });
        }
    },
    async getFactoriesByCompany(req, res) {
        try {
            const { companyId } = req.params;
            const factories = await prisma.factory.findMany({
                where: { companyId },
                include: { lines: true },
            });
            res.status(200).json(factories);
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลโรงงานตามบริษัทได้" });
        }
    },
};
exports.default = exports.factoryController;
//# sourceMappingURL=factoryController.js.map