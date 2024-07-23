// src/controllers/sparePartController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SparePart } from "@prisma/client";

const prisma = new PrismaClient();

export const sparePartController = {
  // สร้างอะไหล่ใหม่
  async createSparePart(req: Request, res: Response): Promise<void> {
    try {
      const {
        sku,
        name,
        detail,
        unit,
        lifespan,
        remainingLifespan,
        maintenanceInterval,
        installationDate,
        machineId,
        quantity,
        minimumQuantity,
        lastReplaced,
      } = req.body;

      const newSparePart: SparePart = await prisma.sparePart.create({
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
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถสร้างอะไหล่ได้" });
    }
  },

  // ดึงข้อมูลอะไหล่ทั้งหมด
  async getAllSpareParts( res: Response): Promise<void> {
    try {
      const spareParts: SparePart[] = await prisma.sparePart.findMany({
        include: { machine: true },
      });
      res.status(200).json(spareParts);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ได้" });
    }
  },

  // ดึงข้อมูลอะไหล่ตาม ID
  async getSparePartById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sparePart: SparePart | null = await prisma.sparePart.findUnique({
        where: { id },
        include: { machine: true },
      });
      if (sparePart) {
        res.status(200).json(sparePart);
      } else {
        res.status(404).json({ error: "ไม่พบอะไหล่" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ได้" });
    }
  },

  // อัปเดตข้อมูลอะไหล่
  async updateSparePart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        sku,
        name,
        detail,
        unit,
        lifespan,
        remainingLifespan,
        maintenanceInterval,
        installationDate,
        machineId,
        quantity,
        minimumQuantity,
        lastReplaced,
      } = req.body;

      const updatedSparePart: SparePart = await prisma.sparePart.update({
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
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลอะไหล่ได้" });
    }
  },

  // ลบอะไหล่
  async deleteSparePart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.sparePart.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถลบอะไหล่ได้" });
    }
  },

  // ดึงข้อมูลอะไหล่ตามเครื่องจักร
  async getSparePartsByMachine(req: Request, res: Response): Promise<void> {
    try {
      const { machineId } = req.params;
      const spareParts = await prisma.sparePart.findMany({
        where: { machineId },
      });
      res.status(200).json(spareParts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ตามเครื่องจักรได้" });
    }
  },

  // อัปเดตจำนวนอะไหล่
  async updateSparePartQuantity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const updatedSparePart = await prisma.sparePart.update({
        where: { id },
        data: { quantity },
      });
      res.status(200).json(updatedSparePart);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถอัปเดตจำนวนอะไหล่ได้" });
    }
  },

  // ดึงข้อมูลอะไหล่ที่ต้องสั่งซื้อ (จำนวนต่ำกว่าขั้นต่ำ)
  async getLowStockSpareParts( res: Response): Promise<void> {
    try {
      const lowStockParts = await prisma.sparePart.findMany({
        where: {
          quantity: { lte: prisma.sparePart.fields.minimumQuantity },
        },
        include: { machine: true },
      });
      res.status(200).json(lowStockParts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ที่ต้องสั่งซื้อได้" });
    }
  },

  // บันทึกการเปลี่ยนอะไหล่
  async recordSparePartReplacement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { replacementDate } = req.body;

      // ดึงข้อมูลอะไหล่ปัจจุบัน
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
          remainingLifespan: currentSparePart.lifespan, // ใช้ค่า lifespan ที่ดึงมาจากฐานข้อมูล
        },
      });
      res.status(200).json(updatedSparePart);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถบันทึกการเปลี่ยนอะไหล่ได้" });
    }
  },
};

export default sparePartController;
