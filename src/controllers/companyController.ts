import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  Company as PrismaCompany,
  Factory as PrismaFactory,
} from "@prisma/client";

const prisma = new PrismaClient();

export interface Factory {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  record_status: string | null;
}

export interface Company {
  id: string;
  name: string;
  factories: Factory[];
  createdAt: string;
  updatedAt: string;
  record_status: string | null;
}

const convertCompany = (
  company: PrismaCompany & { factories: PrismaFactory[] }
): Company => ({
  ...company,
  createdAt: company.createdAt.toISOString(),
  updatedAt: company.updatedAt.toISOString(),
  factories: company.factories.map((factory) => ({
    ...factory,
    createdAt: factory.createdAt.toISOString(),
    updatedAt: factory.updatedAt.toISOString(),
  })),
});

export const companyController = {
  async createCompany(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const newCompany = await prisma.company.create({
        data: { name },
        include: { factories: true },
      });
      res.status(201).json(convertCompany(newCompany));
    } catch (error) {
      res.status(500).json({ error: "Unable to create company" });
    }
  },

  async getAllCompanies(req: Request, res: Response): Promise<void> {
    try {
      const companies = await prisma.company.findMany({
        include: {
          factories: true,
        },
      });
      if (companies.length === 0) {
        res.status(404).json({ error: "No companies found" });
        return;
      }
      res.status(200).json(companies.map(convertCompany));
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch companies" });
    }
  },

  async getCompanyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const company = await prisma.company.findUnique({
        where: { id },
        include: { factories: true },
      });
      if (company) {
        res.status(200).json(convertCompany(company));
      } else {
        res.status(404).json({ error: "Company not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch company" });
    }
  },

  async updateCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedCompany = await prisma.company.update({
        where: { id },
        data: { name },
        include: { factories: true },
      });
      res.status(200).json(convertCompany(updatedCompany));
    } catch (error) {
      res.status(500).json({ error: "Unable to update company" });
    }
  },

  async deleteCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.company.delete({ where: { id } });
      res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Unable to delete company" });
    }
  },
};

export default companyController;
