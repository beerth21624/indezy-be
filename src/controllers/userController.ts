import { Request, Response } from "express";
import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export const userController = {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
    }
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: "ไม่พบผู้ใช้" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Get user by ID error:", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
    }
  },

  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, role, status } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          email,
          role: role as UserRole,
          status: status as UserStatus,
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้" });
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id } });
      res.status(200).json({ message: "ลบผู้ใช้สำเร็จ" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "ไม่สามารถลบผู้ใช้ได้" });
    }
  },
  async updateUserRole(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

 

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: role as UserRole },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({ error: "ไม่สามารถอัปเดต role ของผู้ใช้ได้" });
    }
  },

  async assignUserToFactory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { userId, factoryId } = req.body;

      const factory = await prisma.factory.findUnique({
        where: { id: factoryId },
      });

        if (!factory) {
            res.status(404).json({ error: "ไม่พบโรงงาน" });
            return;
        }

        const companyId = factory.companyId;


      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { factoryId , companyId},
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          factory: {
            select: {
              id: true,
              name: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
        }
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Assign user to factory error:", error);
      res.status(500).json({ error: "ไม่สามารถ assign ผู้ใช้ให้กับโรงงานได้" });
    }
  },

  async assignUserToCompany(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { userId, companyId } = req.body;


      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { companyId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Assign user to company error:", error);
      res.status(500).json({ error: "ไม่สามารถ assign ผู้ใช้ให้กับบริษัทได้" });
    }
  },

  async getUsersByFactory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    // ... (โค้ดเดิม)
  },

  async getUsersByCompany(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { companyId } = req.params;

      const users = await prisma.user.findMany({
        where: { companyId },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
        },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error("Get users by company error:", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ตามบริษัทได้" });
    }
  },
};



export default userController;
