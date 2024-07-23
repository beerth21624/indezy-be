
import express from "express";
import machineHourMeterTotalController from "../controllers/machineHourMeterTotalController";

const router = express.Router();

router.post("/", machineHourMeterTotalController.createHourMeterTotal);
router.get("/", machineHourMeterTotalController.getAllHourMeterTotals);
router.get("/:id", machineHourMeterTotalController.getHourMeterTotalById);
router.put("/:id", machineHourMeterTotalController.updateHourMeterTotal);
router.delete("/:id", machineHourMeterTotalController.deleteHourMeterTotal);
router.get(
  "/machine/:machineId",
  machineHourMeterTotalController.getHourMeterTotalsByMachine
);
router.get(
  "/machine/:machineId/range",
  machineHourMeterTotalController.getHourMeterTotalsByDateRange
);
router.get(
  "/machine/:machineId/monthly/:year/:month",
  machineHourMeterTotalController.calculateMonthlyHourMeterTotal
);
router.get(
  "/latest",
  machineHourMeterTotalController.getLatestHourMeterTotalForAllMachines
);

export default router;
