"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const factoryController_1 = __importDefault(require("../controllers/factoryController"));
const router = express_1.default.Router();
router.post("/", factoryController_1.default.createFactory);
router.get("/", factoryController_1.default.getAllFactories);
router.get("/:id", factoryController_1.default.getFactoryById);
router.put("/:id", factoryController_1.default.updateFactory);
router.delete("/:id", factoryController_1.default.deleteFactory);
router.get("/:id/production-lines", factoryController_1.default.getFactoryProductionLines);
router.get("/company/:companyId", factoryController_1.default.getFactoriesByCompany);
exports.default = router;
