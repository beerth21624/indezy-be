"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const machineStatusSegmentController_1 = __importDefault(require("../controllers/machineStatusSegmentController"));
const router = express_1.default.Router();
router.post("/", machineStatusSegmentController_1.default.createMachineStatusSegment);
router.get("/", machineStatusSegmentController_1.default.getAllMachineStatusSegments);
router.get("/:id", machineStatusSegmentController_1.default.getMachineStatusSegmentById);
router.put("/:id", machineStatusSegmentController_1.default.updateMachineStatusSegment);
router.delete("/:id", machineStatusSegmentController_1.default.deleteMachineStatusSegment);
router.get("/machine/:machineId", machineStatusSegmentController_1.default.getStatusSegmentsByMachine);
router.get("/latest", machineStatusSegmentController_1.default.getLatestStatusForAllMachines);
router.get("/machine/:machineId/range", machineStatusSegmentController_1.default.getStatusSegmentsByDateRange);
router.get("/machine/:machineId/uptime", machineStatusSegmentController_1.default.calculateMachineUptime);
exports.default = router;
//# sourceMappingURL=machineStatusSegmentRoutes.js.map