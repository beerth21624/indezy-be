"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const maintenanceTaskController_1 = __importDefault(require("../controllers/maintenanceTaskController"));
const router = express_1.default.Router();
router.post("/", maintenanceTaskController_1.default.createMaintenanceTask);
router.get("/", maintenanceTaskController_1.default.getAllMaintenanceTasks);
router.get("/:id", maintenanceTaskController_1.default.getMaintenanceTaskById);
router.put("/:id", maintenanceTaskController_1.default.updateMaintenanceTask);
router.delete("/:id", maintenanceTaskController_1.default.deleteMaintenanceTask);
router.get("/machine/:machineId", maintenanceTaskController_1.default.getTasksByMachine);
router.get("/assignee/:userId", maintenanceTaskController_1.default.getTasksByAssignee);
router.patch("/:id/status", maintenanceTaskController_1.default.updateTaskStatus);
router.get("/overdue", maintenanceTaskController_1.default.getOverdueTasks);
exports.default = router;
