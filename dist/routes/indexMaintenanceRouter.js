"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexMaintenanceController_1 = require("../controllers/indexMaintenanceController");
const router = express_1.default.Router();
router.post("/rebuild-indexes", ...indexMaintenanceController_1.rebuildAllIndexes);
router.post("/reorganize-index/:tableName/:indexName", ...indexMaintenanceController_1.reorganizeIndex);
router.post("/update-statistics", ...indexMaintenanceController_1.updateStatistics);
router.get("/check-index-performance", ...indexMaintenanceController_1.checkIndexPerformance);
router.post("/remove-unused-indexes", ...indexMaintenanceController_1.removeUnusedIndexes);
exports.default = router;
//# sourceMappingURL=indexMaintenanceRouter.js.map