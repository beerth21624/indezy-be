// src/controllers/authController.ts

import { Request, Response } from "express";
import { PrismaClient,  UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, firstName, lastName, role } = req.body;
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
      });

      if (existingUser) {
        res
          .status(400)
          .json({ error: "ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: role as UserRole,
          status: UserStatus.ACTIVE,
        },
      });

      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "ไม่สามารถลงทะเบียนผู้ใช้ได้" });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        return;
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "ไม่สามารถเข้าสู่ระบบได้" });
    }
  },

  async changePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.user as { userId: string };
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ error: "ไม่พบผู้ใช้" });
        return;
      }

      // ตรวจสอบรหัสผ่านปัจจุบัน
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        res.status(401).json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
        return;
      }

      // เข้ารหัสรหัสผ่านใหม่
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // อัปเดตรหัสผ่าน
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "ไม่สามารถเปลี่ยนรหัสผ่านได้" });
    }
  },

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  async getCurrentUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.user as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: userId },
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
      console.error("Get current user error:", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
    }
  },

  // ออกจากระบบ (ทำได้ที่ฝั่ง client โดยการลบ token)
  async logout(res: Response): Promise<void> {
    res.status(200).json({ message: "ออกจากระบบสำเร็จ" });
  },
};

export default authController;
