// // src/services/predictiveMaintenanceService.ts

// import { PrismaClient } from "@prisma/client";
// import * as tf from "@tensorflow/tfjs-node";
// import logger from "../utils/logger";

// const prisma = new PrismaClient();

// class PredictiveMaintenanceService {
//   private model: tf.LayersModel | null = null;

//   constructor() {
//     this.loadModel();
//   }

//   private async loadModel() {
//     try {
//       this.model = await tf.loadLayersModel(
//         "file://./models/maintenance_model/model.json"
//       );
//       logger.info("Predictive maintenance model loaded successfully");
//     } catch (error) {
//       logger.error("Failed to load predictive maintenance model:", error);
//     }
//   }

//   async predictMaintenance(machineId: string): Promise<{
//     needsMaintenance: boolean;
//     confidenceScore: number;
//     recommendations: string[];
//   }> {
//     try {
//       const sensorData = await this.getLatestSensorData(machineId);
//       const maintenanceHistory = await this.getMaintenanceHistory(machineId);

//       if (!this.model) {
//         throw new Error("Model not loaded");
//       }

//       // Prepare input data for the model
//       const inputData = tf.tensor2d([
//         this.prepareInputData(sensorData, maintenanceHistory),
//       ]);

//       // Make prediction
//       const prediction = this.model.predict(inputData) as tf.Tensor;
//       const predictionData = await prediction.data();

//       const needsMaintenance = predictionData[0] > 0.5;
//       const confidenceScore = predictionData[0];

//       // Generate recommendations based on the prediction and data
//       const recommendations = this.generateRecommendations(
//         sensorData,
//         maintenanceHistory,
//         needsMaintenance,
//         confidenceScore
//       );

//       return {
//         needsMaintenance,
//         confidenceScore,
//         recommendations,
//       };
//     } catch (error) {
//       logger.error("Error in predictMaintenance:", error);
//       throw new Error("Failed to predict maintenance needs");
//     }
//   }

//   private async getLatestSensorData(machineId: string) {
//     return prisma.sensorData.findMany({
//       where: { machineId },
//       orderBy: { timestamp: "desc" },
//       take: 10,
//     });
//   }

//   private async getMaintenanceHistory(machineId: string) {
//     return prisma.maintenanceTask.findMany({
//       where: { machineId },
//       orderBy: { completedAt: "desc" },
//       take: 5,
//     });
//   }

//   private prepareInputData(
//     sensorData: any[],
//     maintenanceHistory: any[]
//   ): number[] {
//     const processedSensorData = sensorData.flatMap((data) => [
//       data.temperature / 100,
//       data.vibration / 10,
//       data.pressure / 1000,
//     ]);

//     const daysSinceLastMaintenance =
//       maintenanceHistory.length > 0
//         ? (Date.now() - new Date(maintenanceHistory[0].completedAt).getTime()) /
//           (1000 * 60 * 60 * 24)
//         : 365;

//     return [...processedSensorData, daysSinceLastMaintenance / 365];
//   }

//   private generateRecommendations(
//     sensorData: any[],
//     maintenanceHistory: any[],
//     needsMaintenance: boolean,
//     confidenceScore: number
//   ): string[] {
//     const recommendations: string[] = [];

//     // Analyze temperature
//     const latestTemperature = sensorData[0].temperature;
//     if (latestTemperature > 80) {
//       recommendations.push("Check and service cooling system immediately.");
//     } else if (latestTemperature > 60) {
//       recommendations.push(
//         "Monitor temperature closely and plan for cooling system maintenance."
//       );
//     }

//     // Analyze vibration
//     const latestVibration = sensorData[0].vibration;
//     if (latestVibration > 8) {
//       recommendations.push(
//         "Inspect for loose parts or misalignment. Consider immediate maintenance."
//       );
//     } else if (latestVibration > 5) {
//       recommendations.push(
//         "Schedule vibration analysis to identify potential issues."
//       );
//     }

//     // Analyze pressure
//     const latestPressure = sensorData[0].pressure;
//     if (latestPressure > 900 || latestPressure < 100) {
//       recommendations.push("Check pressure system for leaks or malfunctions.");
//     }

//     // Consider maintenance history
//     const daysSinceLastMaintenance =
//       (Date.now() -
//         new Date(maintenanceHistory[0]?.completedAt || 0).getTime()) /
//       (1000 * 60 * 60 * 24);
//     if (daysSinceLastMaintenance > 180) {
//       recommendations.push(
//         "Perform routine maintenance check as per schedule."
//       );
//     }

//     // If maintenance is needed but no specific issues identified
//     if (needsMaintenance && recommendations.length === 0) {
//       recommendations.push(
//         "Conduct a general inspection based on the high prediction score."
//       );
//     }

//     // Limit to top 3 recommendations
//     return recommendations.slice(0, 3);
//   }
// }

// export default new PredictiveMaintenanceService();
