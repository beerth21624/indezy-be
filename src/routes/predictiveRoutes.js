"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const predictiveController_1 = __importDefault(require("../controllers/predictiveController"));
const router = express_1.default.Router();
router.get("/detect-anomalies", predictiveController_1.default.detectAnomalies);
router.get("/generate-intelligent-report", predictiveController_1.default.generateIntelligentReport);
exports.default = router;
