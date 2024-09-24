"use strict";
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
exports.companyController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const convertCompany = (company) => (Object.assign(Object.assign({}, company), { createdAt: company.createdAt.toISOString(), updatedAt: company.updatedAt.toISOString(), factories: company.factories.map((factory) => (Object.assign(Object.assign({}, factory), { createdAt: factory.createdAt.toISOString(), updatedAt: factory.updatedAt.toISOString() }))) }));
exports.companyController = {
    createCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const newCompany = yield prisma.company.create({
                    data: { name },
                    include: { factories: true },
                });
                res.status(201).json(convertCompany(newCompany));
            }
            catch (error) {
                res.status(500).json({ error: "Unable to create company" });
            }
        });
    },
    getAllCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield prisma.company.findMany({
                    include: {
                        factories: true,
                    },
                });
                if (companies.length === 0) {
                    res.status(404).json({ error: "No companies found" });
                    return;
                }
                res.status(200).json(companies.map(convertCompany));
            }
            catch (error) {
                res.status(500).json({ error: "Unable to fetch companies" });
            }
        });
    },
    getCompanyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const company = yield prisma.company.findUnique({
                    where: { id },
                    include: { factories: true },
                });
                if (company) {
                    res.status(200).json(convertCompany(company));
                }
                else {
                    res.status(404).json({ error: "Company not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Unable to fetch company" });
            }
        });
    },
    updateCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name } = req.body;
                const updatedCompany = yield prisma.company.update({
                    where: { id },
                    data: { name },
                    include: { factories: true },
                });
                res.status(200).json(convertCompany(updatedCompany));
            }
            catch (error) {
                res.status(500).json({ error: "Unable to update company" });
            }
        });
    },
    deleteCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma.company.delete({ where: { id } });
                res.status(200).json({ message: "Company deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ error: "Unable to delete company" });
            }
        });
    },
};
exports.default = exports.companyController;
