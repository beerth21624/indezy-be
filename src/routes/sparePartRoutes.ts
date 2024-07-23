import express from "express";
import machineController from "../controllers/machineController";

const router = express.Router();

router.post("/", machineController.createMachine);
router.get("/", machineController.getAllMachines);
router.get("/:id", machineController.getMachineById);
router.put("/:id", machineController.updateMachine);
router.delete("/:id", machineController.deleteMachine);
router.get("/:id/latest-status", machineController.getMachineLatestStatus);
router.get(
  "/:id/latest-hour-meter",
  machineController.getMachineLatestHourMeter
);
router.get(
  "/:id/latest-power-metric",
  machineController.getMachineLatestPowerMetric
);
router.get(
  "/:id/maintenance-tasks",
  machineController.getMachineMaintenanceTasks
);
router.get("/:id/spare-parts", machineController.getMachineSpareParts);

export default router;
