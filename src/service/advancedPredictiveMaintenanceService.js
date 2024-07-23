"use strict";
// // src/services/advancedPredictiveMaintenanceService.ts
// import { PrismaClient } from "@prisma/client";
// import * as tf from "@tensorflow/tfjs-node";
// import logger from "../utils/logger";
// const prisma = new PrismaClient();
// class AdvancedPredictiveMaintenanceService {
//   private maintenanceModel: tf.LayersModel | null = null;
//   private timeToFailureModel: tf.LayersModel | null = null;
//   constructor() {
//     this.loadModels();
//   }
//   private async loadModels() {
//     try {
//       this.maintenanceModel = await tf.loadLayersModel(
//         "file://./models/maintenance_model/model.json"
//       );
//       this.timeToFailureModel = await tf.loadLayersModel(
//         "file://./models/time_to_failure_model/model.json"
//       );
//       logger.info("Predictive maintenance models loaded successfully");
//     } catch (error) {
//       logger.error("Failed to load predictive maintenance models:", error);
//     }
//   }
//   async predictMaintenance(machineId: string): Promise<{
//     needsMaintenance: boolean;
//     confidenceScore: number;
//     estimatedTimeToFailure: number;
//     recommendations: string[];
//   }> {
//     try {
//       const sensorData = await this.getLatestSensorData(machineId);
//       const maintenanceHistory = await this.getMaintenanceHistory(machineId);
//       if (!this.maintenanceModel || !this.timeToFailureModel) {
//         throw new Error("Models not loaded");
//       }
//       const inputData = this.prepareInputData(sensorData, maintenanceHistory);
//       // Predict maintenance need
//       const maintenancePrediction = this.maintenanceModel.predict(
//         tf.tensor2d([inputData])
//       ) as tf.Tensor;
//       const [needsMaintenance, confidenceScore] =
//         await maintenancePrediction.data();
//       // Predict time to failure
//       const timeToFailurePrediction = this.timeToFailureModel.predict(
//         tf.tensor2d([inputData])
//       ) as tf.Tensor;
//       const [estimatedTimeToFailure] = await timeToFailurePrediction.data();
//       const recommendations = this.generateRecommendations(
//         sensorData,
//         maintenanceHistory,
//         needsMaintenance > 0.5,
//         confidenceScore,
//         estimatedTimeToFailure
//       );
//       return {
//         needsMaintenance: needsMaintenance > 0.5,
//         confidenceScore,
//         estimatedTimeToFailure, // in days
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
//     confidenceScore: number,
//     estimatedTimeToFailure: number
//   ): string[] {
//     const recommendations: string[] = [];
//     // Analyze estimated time to failure
//     if (estimatedTimeToFailure < 7) {
//       recommendations.push(
//         `ควรดำเนินการบำรุงรักษาโดยด่วน เนื่องจากคาดการณ์ว่าเครื่องจักรอาจเสียภายใน ${Math.ceil(
//           estimatedTimeToFailure
//         )} วัน`
//       );
//     } else if (estimatedTimeToFailure < 30) {
//       recommendations.push(
//         `วางแผนการบำรุงรักษาภายใน ${Math.ceil(
//           estimatedTimeToFailure
//         )} วัน เพื่อป้องกันการเสียหาย`
//       );
//     }
//     // Analyze temperature
//     const latestTemperature = sensorData[0].temperature;
//     if (latestTemperature > 80) {
//       recommendations.push("ตรวจสอบและซ่อมบำรุงระบบระบายความร้อนทันที");
//     } else if (latestTemperature > 60) {
//       recommendations.push(
//         "เฝ้าระวังอุณหภูมิอย่างใกล้ชิดและวางแผนบำรุงรักษาระบบระบายความร้อน"
//       );
//     }
//     // Analyze vibration
//     const latestVibration = sensorData[0].vibration;
//     if (latestVibration > 8) {
//       recommendations.push(
//         "ตรวจสอบชิ้นส่วนที่หลวมหรือการวางแนวที่ไม่ถูกต้อง พิจารณาบำรุงรักษาทันที"
//       );
//     } else if (latestVibration > 5) {
//       recommendations.push(
//         "จัดตารางการวิเคราะห์การสั่นสะเทือนเพื่อระบุปัญหาที่อาจเกิดขึ้น"
//       );
//     }
//     // Analyze pressure
//     const latestPressure = sensorData[0].pressure;
//     if (latestPressure > 900 || latestPressure < 100) {
//       recommendations.push(
//         "ตรวจสอบระบบความดันเพื่อหาการรั่วไหลหรือการทำงานผิดปกติ"
//       );
//     }
//     // Consider maintenance history
//     const daysSinceLastMaintenance =
//       (Date.now() -
//         new Date(maintenanceHistory[0]?.completedAt || 0).getTime()) /
//       (1000 * 60 * 60 * 24);
//     if (daysSinceLastMaintenance > 180) {
//       recommendations.push("ดำเนินการตรวจสอบการบำรุงรักษาตามกำหนดเวลาปกติ");
//     }
//     // If maintenance is needed but no specific issues identified
//     if (needsMaintenance && recommendations.length === 0) {
//       recommendations.push(
//         `ทำการตรวจสอบทั่วไปตามคะแนนการทำนายที่สูง (${(
//           confidenceScore * 100
//         ).toFixed(2)}%)`
//       );
//     }
//     // Limit to top 3 recommendations
//     return recommendations.slice(0, 3);
//   }
// }
// export default new AdvancedPredictiveMaintenanceService();
