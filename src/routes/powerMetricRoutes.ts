import express from "express";
import powerMetricController from "../controllers/powerMetricController";

const router = express.Router();

router.post("/", powerMetricController.createPowerMetric);
router.get("/", powerMetricController.getAllPowerMetrics);
router.get("/:id", powerMetricController.getPowerMetricById);
router.put("/:id", powerMetricController.updatePowerMetric);
router.delete("/:id", powerMetricController.deletePowerMetric);
router.get(
  "/machine/:machineId",
  powerMetricController.getPowerMetricsByMachine
);
router.get(
  "/machine/:machineId/range",
  powerMetricController.getPowerMetricsByDateRange
);
router.get(
  "/machine/:machineId/daily/:date",
  powerMetricController.calculateDailyPowerConsumption
);
router.get("/latest", powerMetricController.getLatestPowerMetricForAllMachines);

export default router;
