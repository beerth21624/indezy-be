// src/controllers/factoryController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Factory } from "@prisma/client";

const prisma = new PrismaClient();

export const factoryController = {
  // สร้างโรงงานใหม่
  async createFactory(req: Request, res: Response): Promise<void> {
    try {
      const { name, companyId } = req.body;
      const newFactory: Factory = await prisma.factory.create({
        data: {
          name,
          company: { connect: { id: companyId } },
        },
      });
      res.status(201).json(newFactory);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถสร้างโรงงานได้" });
    }
  },

  // ดึงข้อมูลโรงงานทั้งหมด
  async getAllFactories(req: Request, res: Response): Promise<void> {
    try {
      const factories: Factory[] = await prisma.factory.findMany({
        include: { company: true },
      });
      res.status(200).json(factories);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลโรงงานได้" });
    }
  },

  // ดึงข้อมูลโรงงานตาม ID
  async getFactoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const factory: Factory | null = await prisma.factory.findUnique({
        where: { id },
        include: {
          company: true,
          lines: true, // รวมข้อมูลสายการผลิตด้วย
        },
      });
      if (factory) {
        res.status(200).json(factory);
      } else {
        res.status(404).json({ error: "ไม่พบโรงงาน" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลโรงงานได้" });
    }
  },

  // อัปเดตข้อมูลโรงงาน
  async updateFactory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, companyId } = req.body;
      const updatedFactory: Factory = await prisma.factory.update({
        where: { id },
        data: {
          name,
          company: companyId ? { connect: { id: companyId } } : undefined,
        },
      });
      res.status(200).json(updatedFactory);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลโรงงานได้" });
    }
  },

  // ลบโรงงาน
  async deleteFactory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
     const resault= await prisma.factory.delete({
        where: { id },
      });
      if (resault) {
        res.status(200).json({ message: "ลบโรงงานเรียบร้อยแล้ว" });
      } else {
        res.status(404).json({ error: "ไม่พบโรงงาน" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถลบโรงงานได้" });
    }
  },

  // ดึงข้อมูลสายการผลิตของโรงงาน
  async getFactoryProductionLines(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productionLines = await prisma.productionLine.findMany({
        where: { factoryId: id },
      });
      res.status(200).json(productionLines);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตของโรงงานได้" });
    }
  },

  // ดึงข้อมูลโรงงานตามบริษัท
  async getFactoriesByCompany(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const factories = await prisma.factory.findMany({
        where: { companyId },
        include: { lines: true },
      });
      res.status(200).json(factories);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลโรงงานตามบริษัทได้" });
    }
  },
};

export default factoryController;
