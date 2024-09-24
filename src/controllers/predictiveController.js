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
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictiveController = void 0;
const client_1 = require("@prisma/client");
const generative_ai_1 = require("@google/generative-ai");
const generateMockPowerMetric_1 = require("../utils/generateMockPowerMetric");
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
exports.predictiveController = {
    detectAnomalies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId, mockSize } = req.query;
                let recentData;
                if (mockSize) {
                    const size = parseInt(mockSize, 10);
                    recentData = Array.from({ length: size }, (_, i) => (0, generateMockPowerMetric_1.generateMockPowerMetric)(i));
                }
                else {
                    recentData = yield prisma.powerMetric.findMany({
                        where: { machineId: machineId },
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
                const result = yield model.generateContent(prompt);
                const markdownResponse = result.response.text();
                res.json({ markdown: markdownResponse });
            }
            catch (error) {
                res.status(500).json({ error: "Failed to detect anomalies" });
            }
        });
    },
    generateIntelligentReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { machineId, startDate, endDate, mockSize } = req.query;
                let reportData;
                if (mockSize) {
                    const size = parseInt(mockSize, 10);
                    reportData = Array.from({ length: size }, (_, i) => (0, generateMockPowerMetric_1.generateMockPowerMetric)(i));
                }
                else {
                    reportData = yield prisma.powerMetric.findMany({
                        where: {
                            machineId: machineId,
                            timestamp: {
                                gte: new Date(startDate),
                                lte: new Date(endDate),
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
                const result = yield model.generateContent(prompt);
                const markdownReport = result.response.text();
                res.json({ markdown: markdownReport });
            }
            catch (error) {
                res.status(500).json({ error: "Failed to generate intelligent report" });
            }
        });
    },
};
exports.default = exports.predictiveController;
