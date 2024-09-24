"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const machineController_1 = __importDefault(require("../controllers/machineController"));
const router = express_1.default.Router();
router.get("/status/:company_id?/:factory_id?/:productionLine_id?", machineController_1.default.getMachineWithStatus);
router.get("/status/all", machineController_1.default.getMachineLatestStatus);
router.post("/", machineController_1.default.createMachine);
router.get("/", machineController_1.default.getAllMachines);
router.get("/:id", machineController_1.default.getMachineById);
router.put("/:id", machineController_1.default.updateMachine);
router.delete("/:id", machineController_1.default.deleteMachine);
router.get("/:id/latest-hour-meter", machineController_1.default.getMachineLatestHourMeter);
router.get("/:id/latest-power-metric", machineController_1.default.getMachineLatestPowerMetric);
router.get("/:id/maintenance-tasks", machineController_1.default.getMachineMaintenanceTasks);
router.get("/:id/spare-parts", machineController_1.default.getMachineSpareParts);
exports.default = router;
//# sourceMappingURL=machineRoutes.js.map