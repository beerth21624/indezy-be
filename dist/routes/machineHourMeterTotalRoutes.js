"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const machineHourMeterTotalController_1 = __importDefault(require("../controllers/machineHourMeterTotalController"));
const router = express_1.default.Router();
router.post("/", machineHourMeterTotalController_1.default.createHourMeterTotal);
router.get("/", machineHourMeterTotalController_1.default.getAllHourMeterTotals);
router.get("/:id", machineHourMeterTotalController_1.default.getHourMeterTotalById);
router.put("/:id", machineHourMeterTotalController_1.default.updateHourMeterTotal);
router.delete("/:id", machineHourMeterTotalController_1.default.deleteHourMeterTotal);
router.get("/machine/:machineId", machineHourMeterTotalController_1.default.getHourMeterTotalsByMachine);
router.get("/machine/:machineId/range", machineHourMeterTotalController_1.default.getHourMeterTotalsByDateRange);
router.get("/machine/:machineId/monthly/:year/:month", machineHourMeterTotalController_1.default.calculateMonthlyHourMeterTotal);
router.get("/latest", machineHourMeterTotalController_1.default.getLatestHourMeterTotalForAllMachines);
exports.default = router;
//# sourceMappingURL=machineHourMeterTotalRoutes.js.map