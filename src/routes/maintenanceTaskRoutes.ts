import express from "express";
import maintenanceTaskController from "../controllers/maintenanceTaskController";

const router = express.Router();

router.post("/", maintenanceTaskController.createMaintenanceTask);
router.get("/", maintenanceTaskController.getAllMaintenanceTasks);
router.get("/:id", maintenanceTaskController.getMaintenanceTaskById);
router.put("/:id", maintenanceTaskController.updateMaintenanceTask);
router.delete("/:id", maintenanceTaskController.deleteMaintenanceTask);
router.get("/machine/:machineId", maintenanceTaskController.getTasksByMachine);
router.get("/assignee/:userId", maintenanceTaskController.getTasksByAssignee);
router.patch("/:id/status", maintenanceTaskController.updateTaskStatus);
router.get("/overdue", maintenanceTaskController.getOverdueTasks);

export default router;
