"use strict";
// src/controllers/productionLineController.ts
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
exports.productionLineController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.productionLineController = {
    // สร้างสายการผลิตใหม่
    createProductionLine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, factoryId } = req.body;
                const newProductionLine = yield prisma.productionLine.create({
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
        });
    },
    // ดึงข้อมูลสายการผลิตทั้งหมด
    getAllProductionLines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionLines = yield prisma.productionLine.findMany({
                    include: { factory: true },
                });
                res.status(200).json(productionLines);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตได้" });
            }
        });
    },
    // ดึงข้อมูลสายการผลิตตาม ID
    getProductionLineById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const productionLine = yield prisma.productionLine.findUnique({
                    where: { id },
                    include: {
                        factory: true,
                        machines: true, // รวมข้อมูลเครื่องจักรด้วย
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
        });
    },
    // อัปเดตข้อมูลสายการผลิต
    updateProductionLine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, factoryId } = req.body;
                const updatedProductionLine = yield prisma.productionLine.update({
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
        });
    },
    // ลบสายการผลิต
    deleteProductionLine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const resault = yield prisma.productionLine.delete({
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
        });
    },
    // ดึงข้อมูลเครื่องจักรของสายการผลิต
    getProductionLineMachines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const machines = yield prisma.machine.findMany({
                    where: { productionLineId: id },
                });
                res.status(200).json(machines);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลเครื่องจักรของสายการผลิตได้" });
            }
        });
    },
    // ดึงข้อมูลสายการผลิตตามโรงงาน
    getProductionLinesByFactory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { factoryId } = req.params;
                const productionLines = yield prisma.productionLine.findMany({
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
        });
    },
};
exports.default = exports.productionLineController;
