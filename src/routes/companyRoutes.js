"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyController_1 = __importDefault(require("../controllers/companyController"));
const redisMiddleware_1 = require("../middleware/redisMiddleware");
const router = express_1.default.Router();
console.log("getAllCompanies");
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield companyController_1.default.createCompany(req, res);
    (0, redisMiddleware_1.clearCache)(["/companies"]); // Clear cache for getAllCompanies
    next();
}));
router.get("/", (0, redisMiddleware_1.cacheMiddleware)(60), companyController_1.default.getAllCompanies);
router.get("/:id", (0, redisMiddleware_1.cacheMiddleware)(60), companyController_1.default.getCompanyById);
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield companyController_1.default.updateCompany(req, res);
    (0, redisMiddleware_1.clearCache)(["/companies", `/companies/${req.params.id}`]);
    next();
}));
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield companyController_1.default.deleteCompany(req, res);
    (0, redisMiddleware_1.clearCache)(["/companies", `/companies/${req.params.id}`]);
    next();
}));
exports.default = router;
