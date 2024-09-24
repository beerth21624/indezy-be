"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const convertCompany = (company) => (Object.assign(Object.assign({}, company), { createdAt: company.createdAt.toISOString(), updatedAt: company.updatedAt.toISOString(), factories: company.factories.map((factory) => (Object.assign(Object.assign({}, factory), { createdAt: factory.createdAt.toISOString(), updatedAt: factory.updatedAt.toISOString() }))) }));
exports.companyController = {
    async createCompany(req, res) {
        try {
            const { name } = req.body;
            const newCompany = await prisma.company.create({
                data: { name },
                include: { factories: true },
            });
            res.status(201).json(convertCompany(newCompany));
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถสร้างบริษัทได้" });
        }
    },
    async getAllCompanies(res) {
        try {
            const companies = await prisma.company.findMany({
                include: {
                    factories: true,
                },
            });
            res.status(200).json(companies.map(convertCompany));
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลบริษัทได้" });
        }
    },
    async getCompanyById(req, res) {
        try {
            const { id } = req.params;
            const company = await prisma.company.findUnique({
                where: { id },
                include: { factories: true },
            });
            if (company) {
                res.status(200).json(convertCompany(company));
            }
            else {
                res.status(404).json({ error: "ไม่พบบริษัท" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถดึงข้อมูลบริษัทได้" });
        }
    },
    async updateCompany(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedCompany = await prisma.company.update({
                where: { id },
                data: { name },
                include: { factories: true },
            });
            res.status(200).json(convertCompany(updatedCompany));
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลบริษัทได้" });
        }
    },
    async deleteCompany(req, res) {
        try {
            const { id } = req.params;
            const result = await prisma.company.delete({ where: { id } });
            if (result) {
                res.status(200).json({ message: "ลบบริษัทสำเร็จ" });
            }
            else {
                res.status(404).json({ error: "ไม่พบบริษัท" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "ไม่สามารถลบบริษัทได้" });
        }
    },
};
exports.default = exports.companyController;
//# sourceMappingURL=companyController.js.map