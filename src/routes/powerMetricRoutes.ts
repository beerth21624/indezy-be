import express from "express";
import powerMetricController from "../controllers/powerMetricController";

const router = express.Router();

router.post("/", powerMetricController.createPowerMetric);
router.get("/latest", powerMetricController.getLatestPowerMetricForAllMachines);
router.get("/filtered", powerMetricController.getFilteredPowerMetrics);
router.get("/report/csv", powerMetricController.downloadCSVReport);
router.get("/report/pdf", powerMetricController.downloadPDFReport);


router.get(
  "/machine/:machineId/daily/:date",
  powerMetricController.calculateDailyPowerConsumption
);

router.get(
  "/machine/:machineId/range",
  powerMetricController.getPowerMetricsByDateRange
);

router.get(
  "/machine/:machineId",
  powerMetricController.getPowerMetricsByMachine
);

router.get("/:id", powerMetricController.getPowerMetricById);

router.put("/:id", powerMetricController.updatePowerMetric);

router.delete("/:id", powerMetricController.deletePowerMetric);

router.get("/", powerMetricController.getAllPowerMetrics);

export default router;
