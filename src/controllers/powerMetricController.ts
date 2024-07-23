// src/controllers/powerMetricController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PowerMetric } from "@prisma/client";

const prisma = new PrismaClient();

export const powerMetricController = {
  // บันทึกข้อมูล Power Metric ใหม่
  async createPowerMetric(req: Request, res: Response): Promise<void> {
    try {
      const {
        machineId,
        currentAvg,
        voltageV31,
        activePowerW3,
        powerFactorPf2,
        currentDemandDa1,
        voltageAverageVll,
        activePowerT,
        powerFactorPf3,
        currentDemandDa2,
        voltageV1n,
        reactivePowerVar1,
        powerFactorT,
        currentDemandDa3,
        voltageV2n,
        reactivePowerVar2,
        frequencyHz,
        currentA1,
        currentDemandDan,
        voltageV3n,
        reactivePowerVar3,
        harmonicCurrentHiT,
        currentA2,
        currentDemandDavg,
        voltageAverageVln,
        reactivePowerT,
        harmonicVoltageHvT,
        currentA3,
        voltageV12,
        activePowerW1,
        powerFactorPf1,
        currentAn,
        voltageV23,
        activePowerW2,
      } = req.body;

      const newPowerMetric: PowerMetric = await prisma.powerMetric.create({
        data: {
          machine: { connect: { id: machineId } },
          currentAvg,
          voltageV31,
          activePowerW3,
          powerFactorPf2,
          currentDemandDa1,
          voltageAverageVll,
          activePowerT,
          powerFactorPf3,
          currentDemandDa2,
          voltageV1n,
          reactivePowerVar1,
          powerFactorT,
          currentDemandDa3,
          voltageV2n,
          reactivePowerVar2,
          frequencyHz,
          currentA1,
          currentDemandDan,
          voltageV3n,
          reactivePowerVar3,
          harmonicCurrentHiT,
          currentA2,
          currentDemandDavg,
          voltageAverageVln,
          reactivePowerT,
          harmonicVoltageHvT,
          currentA3,
          voltageV12,
          activePowerW1,
          powerFactorPf1,
          currentAn,
          voltageV23,
          activePowerW2,
          timestamp: new Date(),
        },
        include: { machine: true },
      });

      res.status(201).json(newPowerMetric);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถบันทึกข้อมูล Power Metric ได้" });
    }
  },

  // ดึงข้อมูล Power Metric ทั้งหมด
  async getAllPowerMetrics( res: Response): Promise<void> {
    try {
      const powerMetrics: PowerMetric[] = await prisma.powerMetric.findMany({
        include: { machine: true },
      });
      res.status(200).json(powerMetrics);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูล Power Metric ได้" });
    }
  },

  // ดึงข้อมูล Power Metric ตาม ID
  async getPowerMetricById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const powerMetric: PowerMetric | null =
        await prisma.powerMetric.findUnique({
          where: { id },
          include: { machine: true },
        });

      if (powerMetric) {
        res.status(200).json(powerMetric);
      } else {
        res.status(404).json({ error: "ไม่พบข้อมูล Power Metric" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูล Power Metric ได้" });
    }
  },

  // อัปเดตข้อมูล Power Metric
  async updatePowerMetric(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedPowerMetric: PowerMetric = await prisma.powerMetric.update({
        where: { id },
        data: updateData,
        include: { machine: true },
      });

      res.status(200).json(updatedPowerMetric);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูล Power Metric ได้" });
    }
  },

  // ลบข้อมูล Power Metric
  async deletePowerMetric(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.powerMetric.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถลบข้อมูล Power Metric ได้" });
    }
  },

  // ดึงข้อมูล Power Metric ตามเครื่องจักร
  async getPowerMetricsByMachine(req: Request, res: Response): Promise<void> {
    try {
      const { machineId } = req.params;
      const powerMetrics = await prisma.powerMetric.findMany({
        where: { machineId },
        orderBy: { timestamp: "desc" },
      });
      res.status(200).json(powerMetrics);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูล Power Metric ตามเครื่องจักรได้" });
    }
  },

  // ดึงข้อมูล Power Metric ตามช่วงเวลา
  async getPowerMetricsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { machineId } = req.params;
      const { startDate, endDate } = req.query;
      const powerMetrics = await prisma.powerMetric.findMany({
        where: {
          machineId,
          timestamp: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        orderBy: { timestamp: "asc" },
      });
      res.status(200).json(powerMetrics);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูล Power Metric ตามช่วงเวลาได้" });
    }
  },

  // คำนวณสรุปการใช้พลังงานรายวัน
  async calculateDailyPowerConsumption(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { machineId, date } = req.params;
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const powerMetrics = await prisma.powerMetric.findMany({
        where: {
          machineId,
          timestamp: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const dailySummary = powerMetrics.reduce(
        (acc, curr) => {
          acc.totalActivePower += curr.activePowerT;
          acc.totalReactivePower += curr.reactivePowerT;
          acc.count++;
          return acc;
        },
        { totalActivePower: 0, totalReactivePower: 0, count: 0 }
      );

      const averageActivePower =
        dailySummary.totalActivePower / dailySummary.count;
      const averageReactivePower =
        dailySummary.totalReactivePower / dailySummary.count;

      res.status(200).json({
        date,
        averageActivePower,
        averageReactivePower,
        totalReadings: dailySummary.count,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถคำนวณสรุปการใช้พลังงานรายวันได้" });
    }
  },

  // ดึงข้อมูล Power Metric ล่าสุดของแต่ละเครื่อง
  async getLatestPowerMetricForAllMachines(
    res: Response
  ): Promise<void> {
    try {
      const latestPowerMetrics = await prisma.machine.findMany({
        include: {
          powerMetrics: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
      });
      res.status(200).json(latestPowerMetrics);
    } catch (error) {
      res
        .status(500)
        .json({
          error: "ไม่สามารถดึงข้อมูล Power Metric ล่าสุดของแต่ละเครื่องได้",
        });
    }
  },
};

export default powerMetricController;
