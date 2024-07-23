// src/controllers/machineHourMeterTotalController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { MachineHourMeterTotal } from "@prisma/client";

const prisma = new PrismaClient();

export const machineHourMeterTotalController = {
  // บันทึกข้อมูลชั่วโมงการทำงานใหม่
  async createHourMeterTotal(req: Request, res: Response): Promise<void> {
    try {
      const { machineId, normal, stop, risk, abnormal, date } = req.body;

      const newHourMeterTotal: MachineHourMeterTotal =
        await prisma.machineHourMeterTotal.create({
          data: {
            machine: { connect: { id: machineId } },
            normal,
            stop,
            risk,
            abnormal,
            total: normal + stop + risk + abnormal,
            date: new Date(date),
          },
          include: {
            machine: true,
          },
        });

      res.status(201).json(newHourMeterTotal);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถบันทึกข้อมูลชั่วโมงการทำงานได้" });
    }
  },

  // ดึงข้อมูลชั่วโมงการทำงานทั้งหมด
  async getAllHourMeterTotals(res: Response): Promise<void> {
    try {
      const hourMeterTotals: MachineHourMeterTotal[] =
        await prisma.machineHourMeterTotal.findMany({
          include: {
            machine: true,
          },
        });
      res.status(200).json(hourMeterTotals);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานได้" });
    }
  },

  // ดึงข้อมูลชั่วโมงการทำงานตาม ID
  async getHourMeterTotalById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const hourMeterTotal: MachineHourMeterTotal | null =
        await prisma.machineHourMeterTotal.findUnique({
          where: { id },
          include: {
            machine: true,
          },
        });

      if (hourMeterTotal) {
        res.status(200).json(hourMeterTotal);
      } else {
        res.status(404).json({ error: "ไม่พบข้อมูลชั่วโมงการทำงาน" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานได้" });
    }
  },

  // อัปเดตข้อมูลชั่วโมงการทำงาน
  async updateHourMeterTotal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { normal, stop, risk, abnormal, date } = req.body;

      const updatedHourMeterTotal: MachineHourMeterTotal =
        await prisma.machineHourMeterTotal.update({
          where: { id },
          data: {
            normal,
            stop,
            risk,
            abnormal,
            total: normal + stop + risk + abnormal,
            date: new Date(date),
          },
          include: {
            machine: true,
          },
        });

      res.status(200).json(updatedHourMeterTotal);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถอัปเดตข้อมูลชั่วโมงการทำงานได้" });
    }
  },

  // ลบข้อมูลชั่วโมงการทำงาน
  async deleteHourMeterTotal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.machineHourMeterTotal.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถลบข้อมูลชั่วโมงการทำงานได้" });
    }
  },

  // ดึงข้อมูลชั่วโมงการทำงานตามเครื่องจักร
  async getHourMeterTotalsByMachine(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { machineId } = req.params;
      const hourMeterTotals = await prisma.machineHourMeterTotal.findMany({
        where: { machineId },
        orderBy: { date: "desc" },
      });
      res.status(200).json(hourMeterTotals);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานตามเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูลชั่วโมงการทำงานตามช่วงเวลา
  async getHourMeterTotalsByDateRange(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { machineId } = req.params;
      const { startDate, endDate } = req.query;
      const hourMeterTotals = await prisma.machineHourMeterTotal.findMany({
        where: {
          machineId,
          date: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        orderBy: { date: "asc" },
      });
      res.status(200).json(hourMeterTotals);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานตามช่วงเวลาได้" });
    }
  },

  // คำนวณสรุปชั่วโมงการทำงานรายเดือน
  async calculateMonthlyHourMeterTotal(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { machineId, year, month } = req.params;
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      const hourMeterTotals = await prisma.machineHourMeterTotal.findMany({
        where: {
          machineId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const monthlySummary = hourMeterTotals.reduce(
        (acc, curr) => {
          acc.normal += curr.normal;
          acc.stop += curr.stop;
          acc.risk += curr.risk;
          acc.abnormal += curr.abnormal;
          acc.total += curr.total;
          return acc;
        },
        { normal: 0, stop: 0, risk: 0, abnormal: 0, total: 0 }
      );

      res.status(200).json(monthlySummary);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถคำนวณสรุปชั่วโมงการทำงานรายเดือนได้" });
    }
  },

  // ดึงข้อมูลชั่วโมงการทำงานล่าสุดของแต่ละเครื่อง
  async getLatestHourMeterTotalForAllMachines(

    res: Response
  ): Promise<void> {
    try {
      const latestHourMeterTotals = await prisma.machine.findMany({
        include: {
          hourMeterTotals: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      });
      res.status(200).json(latestHourMeterTotals);
    } catch (error) {
      res
        .status(500)
        .json({
          error: "ไม่สามารถดึงข้อมูลชั่วโมงการทำงานล่าสุดของแต่ละเครื่องได้",
        });
    }
  },
};

export default machineHourMeterTotalController;
