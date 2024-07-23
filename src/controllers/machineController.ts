// src/controllers/machineController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Machine } from "@prisma/client";

const prisma = new PrismaClient();

export const machineController = {
  // สร้างเครื่องจักรใหม่
  async createMachine(req: Request, res: Response): Promise<void> {
    try {
      const { name, type, installationDate, productionLineId } = req.body;
      const newMachine: Machine = await prisma.machine.create({
        data: {
          name,
          type,
          installationDate: new Date(installationDate),
          productionLine: { connect: { id: productionLineId } },
        },
      });
      res.status(201).json(newMachine);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถสร้างเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลเครื่องจักรทั้งหมด
  async getAllMachines(req: Request, res: Response): Promise<void> {
    try {
      const machines: Machine[] = await prisma.machine.findMany({
        include: { productionLine: true },
      });
      res.status(200).json(machines);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลเครื่องจักรตาม ID
  async getMachineById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const machine: Machine | null = await prisma.machine.findUnique({
        where: { id },
        include: {
          productionLine: true,
          maintenanceTasks: true,
          spareParts: true,
          statusSegments: true,
          hourMeterTotals: true,
          powerMetrics: true,
        },
      });
      if (machine) {
        res.status(200).json(machine);
      } else {
        res.status(404).json({ error: "ไม่พบเครื่องจักร" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลเครื่องจักรได้" });
    }
  },

  async getMachineWithStatus(req: Request, res: Response): Promise<void> {
    try {
      const { company_id, factory_id, productionLine_id } = req.params;

      // Build the where clause dynamically based on provided parameters
      const whereClause: any = {};

      if (company_id) {
        whereClause.productionLine = { factory: { companyId: company_id } };
      }

      if (factory_id) {
        whereClause.productionLine = {
          ...whereClause.productionLine,
          factory: { ...whereClause.productionLine?.factory, id: factory_id },
        };
      }

      if (productionLine_id) {
        whereClause.productionLine = {
          ...whereClause.productionLine,
          id: productionLine_id,
        };
      }

      const machines = await prisma.machine.findMany({
        where: whereClause,
        include: {
          statusSegments: {
            orderBy: { endDatetime: "desc" },
            take: 1,
          },
          hourMeterTotals: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      });

      const machineStatuses = machines.map((machine) => ({
        id: machine.id,
        name: machine.name,
        status: machine.statusSegments[0]?.status || "Unknown",
        normal: machine.hourMeterTotals[0]?.normal || 0,
        risk: machine.hourMeterTotals[0]?.risk || 0,
        efficiency: calculateEfficiency(machine.hourMeterTotals[0]),
      }));

      res.status(200).json(machineStatuses);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลสถานะล่าสุดของเครื่องจักรได้" });
    }
  },

  // อัปเดตข้อมูลเครื่องจักร
  async updateMachine(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, type, installationDate, productionLineId } = req.body;
      const updatedMachine: Machine = await prisma.machine.update({
        where: { id },
        data: {
          name,
          type,
          installationDate: new Date(installationDate),
          productionLine: productionLineId
            ? { connect: { id: productionLineId } }
            : undefined,
        },
      });
      res.status(200).json(updatedMachine);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลเครื่องจักรได้" });
    }
  },

  // ลบเครื่องจักร
  async deleteMachine(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resault = await prisma.machine.delete({
        where: { id },
      });
      if (resault) {
        res.status(200).json({ message: "ลบเครื่องจักรสำเร็จ" });
      } else {
        res.status(404).json({ error: "ไม่พบเครื่องจักร" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถลบเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลสถานะล่าสุดของเครื่องจักร
  async getMachineLatestStatus(req: Request, res: Response): Promise<void> {
    try {
      const machines = await prisma.machine.findMany({
        include: {
          statusSegments: {
            orderBy: { endDatetime: "desc" },
            take: 1,
          },
          hourMeterTotals: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      });

      const machineStatuses = machines.map((machine) => ({
        id: machine.id,
        name: machine.name,
        status: machine.statusSegments[0]?.status || "Unknown",
        normal: machine.hourMeterTotals[0]?.normal || 0,
        risk: machine.hourMeterTotals[0]?.risk || 0,
        efficiency: calculateEfficiency(machine.hourMeterTotals[0]),
      }));

      res.status(200).json(machineStatuses);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลสถานะล่าสุดของเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูล Hour Meter ล่าสุดของเครื่องจักร
  async getMachineLatestHourMeter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const latestHourMeter = await prisma.machineHourMeterTotal.findFirst({
        where: { machineId: id },
        orderBy: { date: "desc" },
      });
      res.status(200).json(latestHourMeter);
    } catch (error) {
      res.status(500).json({
        error: "ไม่สามารถดึงข้อมูล Hour Meter ล่าสุดของเครื่องจักรได้",
      });
    }
  },

  // ดึงข้อมูล Power Metric ล่าสุดของเครื่องจักร
  async getMachineLatestPowerMetric(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const latestPowerMetric = await prisma.powerMetric.findFirst({
        where: { machineId: id },
        orderBy: { timestamp: "desc" },
      });
      res.status(200).json(latestPowerMetric);
    } catch (error) {
      res.status(500).json({
        error: "ไม่สามารถดึงข้อมูล Power Metric ล่าสุดของเครื่องจักรได้",
      });
    }
  },

  // ดึงข้อมูลงานบำรุงรักษาของเครื่องจักร
  async getMachineMaintenanceTasks(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const maintenanceTasks = await prisma.maintenanceTask.findMany({
        where: { machineId: id },
        include: { assignedTo: true },
      });
      res.status(200).json(maintenanceTasks);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาของเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลอะไหล่ของเครื่องจักร
  async getMachineSpareParts(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const spareParts = await prisma.sparePart.findMany({
        where: { machineId: id },
      });
      res.status(200).json(spareParts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลอะไหล่ของเครื่องจักรได้" });
    }
  },
};

function calculateEfficiency(hourMeter: any): number {
  if (!hourMeter) return 0;
  const totalHours =
    hourMeter.normal + hourMeter.stop + hourMeter.risk + hourMeter.abnormal;
  return totalHours > 0 ? Math.round((hourMeter.normal / totalHours) * 100) : 0;
}

export default machineController;
