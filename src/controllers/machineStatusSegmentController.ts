// src/controllers/machineStatusSegmentController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { MachineStatusSegment,Machine } from "@prisma/client";

const prisma = new PrismaClient();

export const machineStatusSegmentController = {
  // บันทึกสถานะเครื่องจักรใหม่
  async createMachineStatusSegment(req: Request, res: Response): Promise<void> {
    try {
      const {
        machineId,
        group,
        status,
        description,
        startDatetime,
        endDatetime,
      } = req.body;

      if (!status) {
        res.status(400).json({ error: "กรุณาระบุสถานะ" });
        return;
      }

      const newStatusSegment: MachineStatusSegment =
        await prisma.machineStatusSegment.create({
          data: {
            machine: { connect: { id: machineId } },
            group,
            status,
            description,
            startDatetime: new Date(startDatetime),
            endDatetime: new Date(endDatetime),
          },
          include: {
            machine: true,
          },
        });

      await prisma.machine.update({
        where: { id: machineId },
        data: {
          currentStatus: status,
        },
      });

      res.status(201).json(newStatusSegment);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถบันทึกสถานะเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลสถานะเครื่องจักรทั้งหมด
  async getAllMachineStatusSegments(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const statusSegments: MachineStatusSegment[] =
        await prisma.machineStatusSegment.findMany({
          include: {
            machine: true,
          },
        });
      res.status(200).json(statusSegments);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลสถานะเครื่องจักรตาม ID
  async getMachineStatusSegmentById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const statusSegment: MachineStatusSegment | null =
        await prisma.machineStatusSegment.findUnique({
          where: { id },
          include: {
            machine: true,
          },
        });

      if (statusSegment) {
        res.status(200).json(statusSegment);
      } else {
        res.status(404).json({ error: "ไม่พบข้อมูลสถานะเครื่องจักร" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
    }
  },

  // อัปเดตข้อมูลสถานะเครื่องจักร
  async updateMachineStatusSegment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { group, status, description, startDatetime, endDatetime } =
        req.body;

      const updatedStatusSegment: MachineStatusSegment =
        await prisma.machineStatusSegment.update({
          where: { id },
          data: {
            group,
            status,
            description,
            startDatetime: startDatetime ? new Date(startDatetime) : undefined,
            endDatetime: endDatetime ? new Date(endDatetime) : undefined,
          },
          include: {
            machine: true,
          },
        });

      res.status(200).json(updatedStatusSegment);
    } catch (error) {
      console.log("error", error);
      res
        .status(500)
        .json({ error: "ไม่สามารถอัปเดตข้อมูลสถานะเครื่องจักรได้" });
    }
  },

  // ลบข้อมูลสถานะเครื่องจักร
  async deleteMachineStatusSegment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await prisma.machineStatusSegment.delete({
        where: { id },
      });
      if (result) {
        res
          .status(200)
          .json({ message: "ลบข้อมูลสถานะเครื่องจักรเรียบร้อยแล้ว" });
      } else {
        res.status(404).json({ error: "ไม่พบข้อมูลสถานะเครื่องจักร" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถลบข้อมูลสถานะเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลสถานะเครื่องจักรตามเครื่องจักร
  async getStatusSegmentsByMachine(req: Request, res: Response): Promise<void> {
    try {
      const { machineId } = req.params;
      const statusSegments = await prisma.machineStatusSegment.findMany({
        where: { machineId },
        orderBy: { startDatetime: "desc" },
      });
      res.status(200).json(statusSegments);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรตามเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลสถานะเครื่องจักรล่าสุดของแต่ละเครื่อง
  async getLatestStatusForAllMachines(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const latestStatuses = await prisma.machine.findMany({
        include: {
          statusSegments: {
            orderBy: { endDatetime: "desc" },
            take: 1,
          },
        },
      });
      res.status(200).json(latestStatuses);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลสถานะล่าสุดของเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลสถานะเครื่องจักรตามช่วงเวลา
  async getStatusSegmentsByDateRange(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { machineId } = req.params;
      const { startDate, endDate } = req.query;
      const statusSegments = await prisma.machineStatusSegment.findMany({
        where: {
          machineId,
          startDatetime: { gte: new Date(startDate as string) },
          endDatetime: { lte: new Date(endDate as string) },
        },
        orderBy: { startDatetime: "asc" },
      });
      res.status(200).json(statusSegments);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรตามช่วงเวลาได้" });
    }
  },

  // คำนวณเวลาทำงานของเครื่องจักรตามสถานะ
  async calculateMachineUptime(req: Request, res: Response): Promise<void> {
    try {
      const { machineId } = req.params;
      const { startDate, endDate } = req.query;

      const statusSegments = await prisma.machineStatusSegment.findMany({
        where: {
          machineId,
          startDatetime: { gte: new Date(startDate as string) },
          endDatetime: { lte: new Date(endDate as string) },
        },
      });

      const uptimeByStatus = statusSegments.reduce((acc, segment) => {
        const duration =
          segment.endDatetime.getTime() - segment.startDatetime.getTime();
        acc[segment.status] = (acc[segment.status] || 0) + duration;
        return acc;
      }, {} as Record<string, number>);

      res.status(200).json(uptimeByStatus);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถคำนวณเวลาทำงานของเครื่องจักรได้" });
    }
  },
  async getMachineStatusDetails(req: Request, res: Response): Promise<void> {
    try {
      const { machineIds, startDate, endDate } = req.query;

      if (!machineIds || typeof machineIds !== "string") {
        res.status(400).json({ error: "Invalid machineIds parameter" });
        return;
      }

      const machineIdArray = machineIds.split(",");
      const start = startDate
        ? new Date(startDate as string)
        : new Date(new Date().setHours(0, 0, 0, 0));
      const end = endDate ? new Date(endDate as string) : new Date();

      const statusDetails = await prisma.machineStatusSegment.findMany({
        where: {
          machineId: { in: machineIdArray },
          startDatetime: { gte: start },
          endDatetime: { lte: end },
        },
        orderBy: [{ machineId: "asc" }, { startDatetime: "asc" }],
        include: {
          machine: {
            select: { name: true },
          },
        },
      });

      const formattedDetails = statusDetails.map((detail) => ({
        date: detail.startDatetime.toISOString().split("T")[0],
        machineName: detail.machine.name,
        time: `${detail.startDatetime
          .toTimeString()
          .slice(0, 5)} - ${detail.endDatetime.toTimeString().slice(0, 5)}`,
        status: detail.description, // Using 'description' to represent status or issue
      }));

      res.status(200).json(formattedDetails);
    } catch (error) {
      console.error("Error in getMachineStatusDetails", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
    }
  },
  async getSingleMachineStatusDetails(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { machineId } = req.params;
      const { startDate, endDate } = req.query;

      if (!machineId) {
        res.status(400).json({ error: "Invalid machineId parameter" });
        return;
      }

      const start = startDate
        ? new Date(startDate as string)
        : new Date(new Date().setHours(0, 0, 0, 0));
      const end = endDate ? new Date(endDate as string) : new Date();

      const statusDetails = await prisma.machineStatusSegment.findMany({
        where: {
          machineId: machineId,
          startDatetime: { gte: start },
          endDatetime: { lte: end },
        },
        orderBy: [{ startDatetime: "asc" }],
        include: {
          machine: {
            select: { name: true },
          },
        },
      });

      const formattedDetails = statusDetails.map((detail) => ({
        date: detail.startDatetime.toISOString().split("T")[0],
        machineName: detail.machine.name,
        time: `${detail.startDatetime
          .toTimeString()
          .slice(0, 5)} - ${detail.endDatetime.toTimeString().slice(0, 5)}`,
        status: detail.description,
      }));

      res.status(200).json(formattedDetails);
    } catch (error) {
      console.error("Error in getSingleMachineStatusDetails", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลสถานะเครื่องจักรได้" });
    }
  },
};

export default machineStatusSegmentController;
