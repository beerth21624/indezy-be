import express from "express";
import predictiveController from "../controllers/predictiveController";

const router = express.Router();

router.get("/detect-anomalies", predictiveController.detectAnomalies);
router.get(
  "/generate-intelligent-report",
  predictiveController.generateIntelligentReport
);




export default router;
