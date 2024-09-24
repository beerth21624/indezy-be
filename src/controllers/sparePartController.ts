// src/controllers/sparePartController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SparePart } from "@prisma/client";

const prisma = new PrismaClient();

export const sparePartController = {
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

      const existingSparePart = await prisma.sparePart.findUnique({
        where: { sku },
      });

      if (existingSparePart) {
        res.status(400).json({ error: "อะไหล่ที่มี SKU นี้มีอยู่แล้ว" });
        return;
      }
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
  async getAllSpareParts(req: Request, res: Response): Promise<void> {
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
      const resault = await prisma.sparePart.delete({
        where: { id },
      });
      if (resault) {
        res.status(200).json({ message: "ลบอะไหล่สำเร็จ" });
      } else {
        res.status(404).json({ error: "ไม่พบอะไหล่" });
      }
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
  async getLowStockSpareParts(req: Request, res: Response): Promise<void> {
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
  async getFilteredSpareParts(req: Request, res: Response): Promise<void> {
    try {
      const {
        productionLineIds,
        machineIds,
        sparePartName,
        sku,
        sparePartIds,
        status,
        minRemainingLifespan,
        maxRemainingLifespan,
        page,
        pageSize,
      } = req.query;

      // Pagination parameters
      const pageNumber = page ? parseInt(page as string) : 1;
      const itemsPerPage = pageSize ? parseInt(pageSize as string) : 10;
      const skip = (pageNumber - 1) * itemsPerPage;

      const whereClause: any = buildWhereClause({
        productionLineIds,
        machineIds,
        sparePartName,
        sku,
        sparePartIds,
        status,
        minRemainingLifespan,
        maxRemainingLifespan,
      });

      const [totalCount, spareParts, statistics] = await Promise.all([
        prisma.sparePart.count({ where: whereClause }),
        prisma.sparePart.findMany({
          where: whereClause,
          include: {
            machine: {
              include: {
                productionLine: {
                  include: {
                    factory: true,
                  },
                },
              },
            },
          },
          skip,
          take: itemsPerPage,
        }),
        getSparePartsStatistics(),
      ]);

      const totalPages = Math.ceil(totalCount / itemsPerPage);

      res.status(200).json({data:{
        data: spareParts,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalItems: totalCount,
          itemsPerPage,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1,
        },
        statistics,
      }});
    } catch (error) {
      console.error("Error in getFilteredSpareParts:", error);
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ตามเงื่อนไขที่กำหนดได้" });
    }
  },
};
//get ที่สามาถ filter ตาม production line  machine spare part ไล่ลงมา  หรือช่วยออกแบบหน่อย

export default sparePartController;




function buildWhereClause(filters: any): any {
  const whereClause: any = {};

  if (filters.productionLineIds) {
    whereClause.machine = {
      productionLineId: { in: filters.productionLineIds.split(",") },
    };
  }

  if (filters.machineIds) {
    whereClause.machineId = { in: filters.machineIds.split(",") };
  }

  if (filters.sparePartName) {
    whereClause.name = {
      contains: filters.sparePartName,
      mode: "insensitive",
    };
  }

  if (filters.sku) {
    whereClause.sku = filters.sku;
  }

  if (filters.sparePartIds) {
    whereClause.id = { in: filters.sparePartIds.split(",") };
  }

  if (filters.status) {
    whereClause.remainingLifespan = getLifespanFilter(filters.status);
  }

  if (filters.minRemainingLifespan) {
    whereClause.remainingLifespan = {
      ...whereClause.remainingLifespan,
      gte: parseInt(filters.minRemainingLifespan as string),
    };
  }

  if (filters.maxRemainingLifespan) {
    whereClause.remainingLifespan = {
      ...whereClause.remainingLifespan,
      lte: parseInt(filters.maxRemainingLifespan as string),
    };
  }

  return whereClause;
}

function getLifespanFilter(status: string): any {
  const lifespanPercentage: { gte?: number; lte?: number; lt?: number } = {};
  switch (status) {
    case "normal":
      lifespanPercentage.gte = 50;
      break;
    case "warning":
      lifespanPercentage.gte = 20;
      lifespanPercentage.lt = 50;
      break;
    case "critical":
      lifespanPercentage.lt = 20;
      break;
  }
  return {
    divide: "lifespan",
    multiply: 100,
    ...lifespanPercentage,
  };
}
async function getSparePartsStatistics() {
  interface CountResult {
    count: number;
  }

  const [
    totalSpareParts,
    normalSpareParts,
    warningSpareParts,
    criticalSpareParts,
  ] = await Promise.all([
    prisma.sparePart.count(),
    prisma.$queryRaw<
      CountResult[]
    >`SELECT COUNT(*)::integer as count FROM "SparePart" WHERE "remainingLifespan" >= "lifespan" / 2`,
    prisma.$queryRaw<
      CountResult[]
    >`SELECT COUNT(*)::integer as count FROM "SparePart" WHERE "remainingLifespan" < "lifespan" / 2 AND "remainingLifespan" >= "lifespan" / 5`,
    prisma.$queryRaw<
      CountResult[]
    >`SELECT COUNT(*)::integer as count FROM "SparePart" WHERE "remainingLifespan" < "lifespan" / 5`,
  ]);

  return {
    totalSpareParts,
    normalSpareParts: normalSpareParts[0].count,
    warningSpareParts: warningSpareParts[0].count,
    criticalSpareParts: criticalSpareParts[0].count,
  };
}
