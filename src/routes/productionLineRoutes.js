"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productionLineController_1 = __importDefault(require("../controllers/productionLineController"));
const router = express_1.default.Router();
router.post("/", productionLineController_1.default.createProductionLine);
router.get("/", productionLineController_1.default.getAllProductionLines);
router.get("/:id", productionLineController_1.default.getProductionLineById);
router.put("/:id", productionLineController_1.default.updateProductionLine);
router.delete("/:id", productionLineController_1.default.deleteProductionLine);
router.get("/:id/machines", productionLineController_1.default.getProductionLineMachines);
router.get("/factory/:factoryId", productionLineController_1.default.getProductionLinesByFactory);
exports.default = router;
