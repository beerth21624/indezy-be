"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const factoryRoutes_1 = __importDefault(require("./routes/factoryRoutes"));
const productionLineRoutes_1 = __importDefault(require("./routes/productionLineRoutes"));
const machineRoutes_1 = __importDefault(require("./routes/machineRoutes"));
const sparePartRoutes_1 = __importDefault(require("./routes/sparePartRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const machineHourMeterTotalRoutes_1 = __importDefault(require("./routes/machineHourMeterTotalRoutes"));
const machineStatusSegmentRoutes_1 = __importDefault(require("./routes/machineStatusSegmentRoutes"));
const powerMetricRoutes_1 = __importDefault(require("./routes/powerMetricRoutes"));
const maintenanceTaskRoutes_1 = __importDefault(require("./routes/maintenanceTaskRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (_, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/companies", authMiddleware_1.authenticateToken, companyRoutes_1.default);
app.use("/api/factories", authMiddleware_1.authenticateToken, factoryRoutes_1.default);
app.use("/api/production-lines", authMiddleware_1.authenticateToken, productionLineRoutes_1.default);
app.use("/api/machines", authMiddleware_1.authenticateToken, machineRoutes_1.default);
app.use("/api/spare-part", authMiddleware_1.authenticateToken, sparePartRoutes_1.default);
app.use("/api/machine-hour-meter-total", authMiddleware_1.authenticateToken, machineHourMeterTotalRoutes_1.default);
app.use("/api/machine-status-segment", authMiddleware_1.authenticateToken, machineStatusSegmentRoutes_1.default);
app.use("/api/power-metric", authMiddleware_1.authenticateToken, powerMetricRoutes_1.default);
app.use("/api/maintenance-task", authMiddleware_1.authenticateToken, maintenanceTaskRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map