import express from "express";
import authController from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import {
  loginSchema,
} from "../validations/userValidation";


const router = express.Router();

router.post("/register", authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/change-password",
  authenticateToken,
  authController.changePassword
);
router.get("/me", authenticateToken, authController.getCurrentUser);
router.post("/logout", authenticateToken, authController.logout);

export default router;
