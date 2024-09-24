import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateMockPowerMetric } from "../utils/generateMockPowerMetric";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const predictiveController = {
  async detectAnomalies(req: Request, res: Response): Promise<void> {
    try {
      const { machineId, mockSize } = req.query;
      let recentData;

      if (mockSize) {
        const size = parseInt(mockSize as string, 10);
        recentData = Array.from({ length: size }, (_, i) =>
          generateMockPowerMetric(i)
        );
      } else {
        recentData = await prisma.powerMetric.findMany({
          where: { machineId: machineId as string },
          orderBy: { timestamp: "desc" },
          take: 100, // Last 100 records
        });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analyze the following power consumption data for anomalies:
        ${JSON.stringify(recentData)}
        Identify any unusual patterns or outliers. Provide a detailed markdown report with detected anomalies,
        including timestamp, metric, actual value, expected range, and a brief explanation for each anomaly.
        Format the response in a clear, readable markdown structure.`;

      const result = await model.generateContent(prompt);
      const markdownResponse = result.response.text();

      res.json({ markdown: markdownResponse });
    } catch (error) {
      res.status(500).json({ error: "Failed to detect anomalies" });
    }
  },

  async generateIntelligentReport(req: Request, res: Response): Promise<void> {
    try {
      const { machineId, startDate, endDate, mockSize } = req.query;
      let reportData;

      if (mockSize) {
        const size = parseInt(mockSize as string, 10);
        reportData = Array.from({ length: size }, (_, i) =>
          generateMockPowerMetric(i)
        );
      } else {
        reportData = await prisma.powerMetric.findMany({
          where: {
            machineId: machineId as string,
            timestamp: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          },
          orderBy: { timestamp: "asc" },
        });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate an intelligent report based on the following power consumption data:
        ${JSON.stringify(reportData)}
        Provide a comprehensive analysis including trends, patterns, efficiency metrics, and actionable insights.
        Format the report in markdown with sections for summary, key findings, detailed analysis, and recommendations.
        Use appropriate markdown formatting for headings, lists, and emphasis.`;

      const result = await model.generateContent(prompt);
      const markdownReport = result.response.text();

      res.json({ markdown: markdownReport });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate intelligent report" });
    }
  },
};

export default predictiveController;
