// src/controllers/machineStatusSegmentController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { MachineStatusSegment } from "@prisma/client";

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

      res.status(201).json(newStatusSegment);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถบันทึกสถานะเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลสถานะเครื่องจักรทั้งหมด
  async getAllMachineStatusSegments(
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
            startDatetime: new Date(startDatetime),
            endDatetime: new Date(endDatetime),
          },
          include: {
            machine: true,
          },
        });

      res.status(200).json(updatedStatusSegment);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถอัปเดตข้อมูลสถานะเครื่องจักรได้" });
    }
  },

  // ลบข้อมูลสถานะเครื่องจักร
  async deleteMachineStatusSegment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.machineStatusSegment.delete({
        where: { id },
      });
      res.status(204).send();
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
};

export default machineStatusSegmentController;
