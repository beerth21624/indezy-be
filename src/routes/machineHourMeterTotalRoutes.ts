import express from "express";
import machineHourMeterTotalController from "../controllers/machineHourMeterTotalController";

const router = express.Router();

router.get(
  "/latest",
  machineHourMeterTotalController.getLatestHourMeterTotalForAllMachines
);
router.get(
  "/multi",
  machineHourMeterTotalController.getHourMeterTotalsByMachines
);

router.get(
  "/machine/:machineId/monthly/:year/:month",
  machineHourMeterTotalController.calculateMonthlyHourMeterTotal
);
router.get(
  "/machine/:machineId/range",
  machineHourMeterTotalController.getHourMeterTotalsByDateRange
);
router.get(
  "/machine/:machineId",
  machineHourMeterTotalController.getHourMeterTotalsByMachine
);

router.post("/", machineHourMeterTotalController.createHourMeterTotal);
router.get("/", machineHourMeterTotalController.getAllHourMeterTotals);
router.get("/:id", machineHourMeterTotalController.getHourMeterTotalById);
router.put("/:id", machineHourMeterTotalController.updateHourMeterTotal);
router.delete("/:id", machineHourMeterTotalController.deleteHourMeterTotal);

export default router;
