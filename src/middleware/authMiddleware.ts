import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {

  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "ไม่พบ token การเข้าถึง" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: "token ไม่ถูกต้องหรือหมดอายุ" });
    } else {
      req.user = decoded as { userId: string };

      next();
    }
  });
};

export const authorizeRoles = (roles: UserRole[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });

      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ error: "ไม่มีสิทธิ์เข้าถึงส่วนนี้" });
        return;
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์" });
    }
  };
};

export const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user || user.role !== UserRole.ADMIN) {
      res.status(403).json({ error: "ต้องเป็นผู้ดูแลระบบเท่านั้น" });
      return;
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ผู้ดูแลระบบ" });
  }
};

export const isActive = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "ไม่ได้รับอนุญาตให้เข้าถึง" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user || user.status !== "ACTIVE") {
      res.status(403).json({ error: "บัญชีผู้ใช้ไม่ได้เปิดใช้งาน" });
      return;
    }

    next();
  } catch (error) {
    console.error("Active status check error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบสถานะบัญชี" });
  }
};

// ตัวอย่างการใช้งาน
// router.get('/protected', authenticateToken, (req, res) => {
// เฉพาะผู้ใช้ที่เข้าสู่ระบบแล้วเท่านั้นที่สามารถเข้าถึงได้
// });

// router.get('/managers-only', authenticateToken, authorizeRoles([UserRole.MANAGER]), (req, res) => {
// เฉพาะผู้จัดการเท่านั้นที่สามารถเข้าถึงได้
// });

// router.get('/admin-dashboard', authenticateToken, isAdmin, (req, res) => {
// เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าถึงได้
// });

// router.post('/user-action', authenticateToken, isActive, (req, res) => {
// เฉพาะบัญชีที่เปิดใช้งานเท่านั้นที่สามารถดำเนินการได้
// });
