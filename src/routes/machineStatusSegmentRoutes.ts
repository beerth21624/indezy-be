import express from "express";
import machineStatusSegmentController from "../controllers/machineStatusSegmentController";

const router = express.Router();

router.post("/", machineStatusSegmentController.createMachineStatusSegment);

router.get("/", machineStatusSegmentController.getAllMachineStatusSegments);

router.get(
  "/latest",
  machineStatusSegmentController.getLatestStatusForAllMachines
);

router.get("/details", machineStatusSegmentController.getMachineStatusDetails);

router.get(
  "/machine/:machineId",
  machineStatusSegmentController.getStatusSegmentsByMachine
);

router.get(
  "/machine/:machineId/details",
  machineStatusSegmentController.getSingleMachineStatusDetails
);

router.get(
  "/machine/:machineId/range",
  machineStatusSegmentController.getStatusSegmentsByDateRange
);

router.get(
  "/machine/:machineId/uptime",
  machineStatusSegmentController.calculateMachineUptime
);

router.get("/:id", machineStatusSegmentController.getMachineStatusSegmentById);

router.put("/:id", machineStatusSegmentController.updateMachineStatusSegment);

router.delete(
  "/:id",
  machineStatusSegmentController.deleteMachineStatusSegment
);

export default router;
