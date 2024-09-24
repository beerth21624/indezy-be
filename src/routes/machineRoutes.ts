import express from "express";
import machineController from "../controllers/machineController";
const router = express.Router();


  router.get(
  "/status/:company_id?/:factory_id?/:productionLine_id?",
  machineController.getMachineWithStatus
);
router.get("/status/all", machineController.getMachineLatestStatus);

router.post("/", machineController.createMachine);
router.get("/", machineController.getAllMachines);

router.get("/:id", machineController.getMachineById);
router.put("/:id", machineController.updateMachine);
router.delete("/:id", machineController.deleteMachine);

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
