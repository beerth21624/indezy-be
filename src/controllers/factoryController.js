"use strict";
// src/controllers/factoryController.ts
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
exports.factoryController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.factoryController = {
    // สร้างโรงงานใหม่
    createFactory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, companyId } = req.body;
                const newFactory = yield prisma.factory.create({
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
        });
    },
    // ดึงข้อมูลโรงงานทั้งหมด
    getAllFactories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const factories = yield prisma.factory.findMany({
                    include: { company: true },
                });
                res.status(200).json(factories);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลโรงงานได้" });
            }
        });
    },
    // ดึงข้อมูลโรงงานตาม ID
    getFactoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const factory = yield prisma.factory.findUnique({
                    where: { id },
                    include: {
                        company: true,
                        lines: true, // รวมข้อมูลสายการผลิตด้วย
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
        });
    },
    // อัปเดตข้อมูลโรงงาน
    updateFactory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, companyId } = req.body;
                const updatedFactory = yield prisma.factory.update({
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
        });
    },
    // ลบโรงงาน
    deleteFactory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const resault = yield prisma.factory.delete({
                    where: { id },
                });
                if (resault) {
                    res.status(200).json({ message: "ลบโรงงานเรียบร้อยแล้ว" });
                }
                else {
                    res.status(404).json({ error: "ไม่พบโรงงาน" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถลบโรงงานได้" });
            }
        });
    },
    // ดึงข้อมูลสายการผลิตของโรงงาน
    getFactoryProductionLines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const productionLines = yield prisma.productionLine.findMany({
                    where: { factoryId: id },
                });
                res.status(200).json(productionLines);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตของโรงงานได้" });
            }
        });
    },
    // ดึงข้อมูลโรงงานตามบริษัท
    getFactoriesByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId } = req.params;
                const factories = yield prisma.factory.findMany({
                    where: { companyId },
                    include: { lines: true },
                });
                res.status(200).json(factories);
            }
            catch (error) {
                res.status(500).json({ error: "ไม่สามารถดึงข้อมูลโรงงานตามบริษัทได้" });
            }
        });
    },
};
exports.default = exports.factoryController;
