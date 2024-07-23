// src/controllers/productionLineController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ProductionLine } from "@prisma/client";

const prisma = new PrismaClient();

export const productionLineController = {
  // สร้างสายการผลิตใหม่
  async createProductionLine(req: Request, res: Response): Promise<void> {
    try {
      const { name, factoryId } = req.body;
      const newProductionLine: ProductionLine =
        await prisma.productionLine.create({
          data: {
            name,
            factory: { connect: { id: factoryId } },
          },
        });
      res.status(201).json(newProductionLine);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถสร้างสายการผลิตได้" });
    }
  },

  // ดึงข้อมูลสายการผลิตทั้งหมด
  async getAllProductionLines(res: Response): Promise<void> {
    try {
      const productionLines: ProductionLine[] =
        await prisma.productionLine.findMany({
          include: { factory: true },
        });
      res.status(200).json(productionLines);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตได้" });
    }
  },

  // ดึงข้อมูลสายการผลิตตาม ID
  async getProductionLineById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productionLine: ProductionLine | null =
        await prisma.productionLine.findUnique({
          where: { id },
          include: {
            factory: true,
            machines: true, // รวมข้อมูลเครื่องจักรด้วย
          },
        });
      if (productionLine) {
        res.status(200).json(productionLine);
      } else {
        res.status(404).json({ error: "ไม่พบสายการผลิต" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตได้" });
    }
  },

  // อัปเดตข้อมูลสายการผลิต
  async updateProductionLine(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, factoryId } = req.body;
      const updatedProductionLine: ProductionLine =
        await prisma.productionLine.update({
          where: { id },
          data: {
            name,
            factory: factoryId ? { connect: { id: factoryId } } : undefined,
          },
        });
      res.status(200).json(updatedProductionLine);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลสายการผลิตได้" });
    }
  },

  // ลบสายการผลิต
  async deleteProductionLine(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
     const resault= await prisma.productionLine.delete({
        where: { id },
      });
      if (resault) {
        res.status(200).json({ message: "ลบสายการผลิตสำเร็จ" });
      } else {
        res.status(404).json({ error: "ไม่พบสายการผลิต" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถลบสายการผลิตได้" });
    }
  },

  // ดึงข้อมูลเครื่องจักรของสายการผลิต
  async getProductionLineMachines(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const machines = await prisma.machine.findMany({
        where: { productionLineId: id },
      });
      res.status(200).json(machines);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลเครื่องจักรของสายการผลิตได้" });
    }
  },

  // ดึงข้อมูลสายการผลิตตามโรงงาน
  async getProductionLinesByFactory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { factoryId } = req.params;
      const productionLines = await prisma.productionLine.findMany({
        where: { factoryId },
        include: { machines: true },
      });
      res.status(200).json(productionLines);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลสายการผลิตตามโรงงานได้" });
    }
  },
};

export default productionLineController;
