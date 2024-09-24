import express from "express";
import userController from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateToken, userController.getUsers);
router.get("/:id", authenticateToken, userController.getUserById);
router.put("/:id", authenticateToken, userController.updateUser);
router.delete("/:id", authenticateToken, userController.deleteUser);
router.patch("/:id/role", authenticateToken, userController.updateUserRole);
router.post(
  "/assign-factory",
  authenticateToken,
  userController.assignUserToFactory
);
router.get(
  "/factory/:factoryId",
  authenticateToken,
  userController.getUsersByFactory
);
router.post(
  "/assign-company",
  authenticateToken,
  userController.assignUserToCompany
);
router.get(
  "/company/:companyId",
  authenticateToken,
  userController.getUsersByCompany
);

export default router;
