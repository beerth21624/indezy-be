import express from "express";
import {
  rebuildAllIndexes,
  reorganizeIndex,
  updateStatistics,
  checkIndexPerformance,
  removeUnusedIndexes,
} from "../controllers/indexMaintenanceController";

const router = express.Router();

router.post("/rebuild-indexes", ...rebuildAllIndexes);
router.post("/reorganize-index/:tableName/:indexName", ...reorganizeIndex);
router.post("/update-statistics", ...updateStatistics);
router.get("/check-index-performance", ...checkIndexPerformance);
router.post("/remove-unused-indexes", ...removeUnusedIndexes);

export default router;
