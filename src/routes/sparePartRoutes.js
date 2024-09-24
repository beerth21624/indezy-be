"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sparePartController_1 = __importDefault(require("../controllers/sparePartController"));
const router = express_1.default.Router();
router.get("/", sparePartController_1.default.getAllSpareParts);
router.get("/filtered", sparePartController_1.default.getFilteredSpareParts);
router.get("/low-stock", sparePartController_1.default.getLowStockSpareParts);
router.get("/machine/:machineId", sparePartController_1.default.getSparePartsByMachine);
router.get("/:id", sparePartController_1.default.getSparePartById);
router.post("/", sparePartController_1.default.createSparePart);
router.post("/:id/replace", sparePartController_1.default.recordSparePartReplacement);
router.put("/:id", sparePartController_1.default.updateSparePart);
router.patch("/:id/quantity", sparePartController_1.default.updateSparePartQuantity);
router.delete("/:id", sparePartController_1.default.deleteSparePart);
exports.default = router;
