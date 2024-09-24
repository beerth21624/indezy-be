"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const userValidation_1 = require("../validations/userValidation");
const router = express_1.default.Router();
router.post("/register", authController_1.default.register);
router.post("/login", (0, validationMiddleware_1.validate)(userValidation_1.loginSchema), authController_1.default.login);
router.post("/change-password", authMiddleware_1.authenticateToken, authController_1.default.changePassword);
router.get("/me", authMiddleware_1.authenticateToken, authController_1.default.getCurrentUser);
router.post("/logout", authMiddleware_1.authenticateToken, authController_1.default.logout);
exports.default = router;
