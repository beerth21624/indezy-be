"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyController_1 = __importDefault(require("../controllers/companyController"));
const router = express_1.default.Router();
router.post("/", companyController_1.default.createCompany);
router.get("/", companyController_1.default.getAllCompanies);
router.get("/:id", companyController_1.default.getCompanyById);
router.put("/:id", companyController_1.default.updateCompany);
router.delete("/:id", companyController_1.default.deleteCompany);
exports.default = router;
//# sourceMappingURL=companyRoutes.js.map