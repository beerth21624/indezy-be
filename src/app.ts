import express from "express";
import dotenv from "dotenv";
import cors from "cors";


// Import routes
import companyRoutes from "./routes/companyRoutes";
import factoryRoutes from "./routes/factoryRoutes";
import productionLineRoutes from "./routes/productionLineRoutes";
import machineRoutes from "./routes/machineRoutes";
import sparePartRoutes from "./routes/sparePartRoutes";
import authRoutes from "./routes/authRoutes";
import machineHourMeterTotalRoutes from "./routes/machineHourMeterTotalRoutes";
import machineStatusSegmentRoutes from "./routes/machineStatusSegmentRoutes";
import powerMetricRoutes from "./routes/powerMetricRoutes";
import maintenanceTaskRoutes from "./routes/maintenanceTaskRoutes";


import { authenticateToken } from "./middleware/authMiddleware";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(httpLogger);
// Health check route
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", authenticateToken, companyRoutes);
app.use("/api/factories", authenticateToken, factoryRoutes);
app.use("/api/production-lines", authenticateToken, productionLineRoutes);
app.use("/api/machines", authenticateToken, machineRoutes);
app.use("/api/spare-part", authenticateToken, sparePartRoutes);
app.use("/api/machine-hour-meter-total", authenticateToken, machineHourMeterTotalRoutes);
app.use("/api/machine-status-segment", authenticateToken, machineStatusSegmentRoutes);
app.use("/api/power-metric", authenticateToken, powerMetricRoutes);
app.use("/api/maintenance-task", authenticateToken, maintenanceTaskRoutes);






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
