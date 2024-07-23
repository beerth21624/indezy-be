import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import logger from "../utils/logger";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationOptions = {
      abortEarly: false, // รวบรวมข้อผิดพลาดทั้งหมดแทนที่จะหยุดที่ข้อผิดพลาดแรก
      allowUnknown: true, // อนุญาตให้มี field ที่ไม่ได้ระบุใน schema
      stripUnknown: true, // ลบ field ที่ไม่ได้ระบุใน schema ออก
    };

    const { error, value } = schema.validate(req.body, validationOptions);

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      logger.warn(`Validation error: ${errorMessage}`);
      res
        .status(400)
        .json({ error: "ข้อมูลไม่ถูกต้อง", details: errorMessage });
      return;
    }

    // ถ้าข้อมูลถูกต้อง ให้แทนที่ req.body ด้วยข้อมูลที่ผ่านการ validate แล้ว
    req.body = value;
    next();
  };
};

export default validate;
