"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticateToken, userController_1.default.getUsers);
router.get("/:id", authMiddleware_1.authenticateToken, userController_1.default.getUserById);
router.put("/:id", authMiddleware_1.authenticateToken, userController_1.default.updateUser);
router.delete("/:id", authMiddleware_1.authenticateToken, userController_1.default.deleteUser);
router.patch("/:id/role", authMiddleware_1.authenticateToken, userController_1.default.updateUserRole);
router.post("/assign-factory", authMiddleware_1.authenticateToken, userController_1.default.assignUserToFactory);
router.get("/factory/:factoryId", authMiddleware_1.authenticateToken, userController_1.default.getUsersByFactory);
router.post("/assign-company", authMiddleware_1.authenticateToken, userController_1.default.assignUserToCompany);
router.get("/company/:companyId", authMiddleware_1.authenticateToken, userController_1.default.getUsersByCompany);
exports.default = router;
