"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const powerMetricController_1 = __importDefault(require("../controllers/powerMetricController"));
const router = express_1.default.Router();
router.post("/", powerMetricController_1.default.createPowerMetric);
router.get("/", powerMetricController_1.default.getAllPowerMetrics);
router.get("/:id", powerMetricController_1.default.getPowerMetricById);
router.put("/:id", powerMetricController_1.default.updatePowerMetric);
router.delete("/:id", powerMetricController_1.default.deletePowerMetric);
router.get("/machine/:machineId", powerMetricController_1.default.getPowerMetricsByMachine);
router.get("/machine/:machineId/range", powerMetricController_1.default.getPowerMetricsByDateRange);
router.get("/machine/:machineId/daily/:date", powerMetricController_1.default.calculateDailyPowerConsumption);
router.get("/latest", powerMetricController_1.default.getLatestPowerMetricForAllMachines);
exports.default = router;
//# sourceMappingURL=powerMetricRoutes.js.map