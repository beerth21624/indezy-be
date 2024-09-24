// src/controllers/maintenanceTaskController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { MaintenanceTask, TaskStatus, Priority } from "@prisma/client";

const prisma = new PrismaClient();

export const maintenanceTaskController = {
  // สร้างงานบำรุงรักษาใหม่
  async createMaintenanceTask(req: Request, res: Response): Promise<void> {
    try {
      const {
        machineId,
        task,
        description,
        dueDate,
        priority,
        assignedUserId,
      } = req.body;

      const newTask: MaintenanceTask = await prisma.maintenanceTask.create({
        data: {
          machine: { connect: { id: machineId } },
          task,
          description,
          dueDate: new Date(dueDate),
          status: TaskStatus.PENDING,
          priority: priority as Priority,
          assignedTo: { connect: { id: assignedUserId } },
        },
        include: {
          machine: true,
          assignedTo: true,
        },
      });

      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถสร้างงานบำรุงรักษาได้" });
    }
  },

  // ดึงข้อมูลงานบำรุงรักษาทั้งหมด
  async getAllMaintenanceTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks: MaintenanceTask[] = await prisma.maintenanceTask.findMany({
        include: {
          machine: true,
          assignedTo: true,
        },
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาได้" });
    }
  },

  // ดึงข้อมูลงานบำรุงรักษาตาม ID
  async getMaintenanceTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task: MaintenanceTask | null =
        await prisma.maintenanceTask.findUnique({
          where: { id },
          include: {
            machine: true,
            assignedTo: true,
          },
        });
        if (!task) {
          res.status(200).json([]);
          return;
        }
        res.status(200).json(task);

    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาได้" });
    }
  },

  // อัปเดตข้อมูลงานบำรุงรักษา
  async updateMaintenanceTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { task, description, dueDate, status, priority, assignedUserId } =
        req.body;

      const updatedTask: MaintenanceTask = await prisma.maintenanceTask.update({
        where: { id },
        data: {
          task,
          description,
          dueDate: new Date(dueDate),
          status: status as TaskStatus,
          priority: priority as Priority,
          assignedTo: assignedUserId
            ? { connect: { id: assignedUserId } }
            : undefined,
        },
        include: {
          machine: true,
          assignedTo: true,
        },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลงานบำรุงรักษาได้" });
    }
  },

  // ลบงานบำรุงรักษา
  async deleteMaintenanceTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
     const result = await prisma.maintenanceTask.delete({
        where: { id },
      });
      if(result){
        res.status(200).json({ message: "ลบงานบำรุงรักษาเรียบร้อยแล้ว" });
      }else{
        res.status(404).json({ error: "ไม่พบงานบำรุงรักษา" });
      }
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถลบงานบำรุงรักษาได้" });
    }
  },

  // ดึงงานบำรุงรักษาตามเครื่องจักร
  async getTasksByMachine(req: Request, res: Response): Promise<void> {
    try {
      const { machineId } = req.params;
      const tasks = await prisma.maintenanceTask.findMany({
        where: { machineId },
        include: {
          assignedTo: true,
        },
      });
      res.status(200).json(tasks);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาตามเครื่องจักรได้" });
    }
  },

  // ดึงงานบำรุงรักษาตามผู้รับผิดชอบ
  async getTasksByAssignee(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const tasks = await prisma.maintenanceTask.findMany({
        where: { assignedUserId: userId },
        include: {
          machine: true,
        },
      });
      res.status(200).json(tasks);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาตามผู้รับผิดชอบได้" });
    }
  },

  // อัปเดตสถานะงานบำรุงรักษา
  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedTask = await prisma.maintenanceTask.update({
        where: { id },
        data: {
          status: status as TaskStatus,
          completedAt: status === TaskStatus.COMPLETED ? new Date() : null,
        },
        include: {
          machine: true,
          assignedTo: true,
        },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "ไม่สามารถอัปเดตสถานะงานบำรุงรักษาได้" });
    }
  },

  // ดึงงานบำรุงรักษาที่เกินกำหนด
  async getOverdueTasks(req: Request, res: Response): Promise<void> {
    try {
      const overdueTasks = await prisma.maintenanceTask.findMany({
        where: {
          dueDate: { lt: new Date() },
          status: { not: TaskStatus.COMPLETED },
        },
        include: {
          machine: true,
          assignedTo: true,
        },
      });
      res.status(200).json(overdueTasks);
    } catch (error) {
      res
        .status(500)
        .json({ error: "ไม่สามารถดึงข้อมูลงานบำรุงรักษาที่เกินกำหนดได้" });
    }
  },
};

export default maintenanceTaskController;
