import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PowerMetric } from "@prisma/client";
import {generateMockPowerMetric} from "../utils/generateMockPowerMetric";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";


const prisma = new PrismaClient();


export const powerMetricController = {
  // Create a new Power Metric
  async createPowerMetric(req: Request, res: Response): Promise<void> {
    try {
      const {
        machineId,
        currentAvg,
        voltageV31,
        activePowerW3,
        powerFactorPf2,
        currentDemandDa1,
        voltageAverageVll,
        activePowerT,
        powerFactorPf3,
        currentDemandDa2,
        voltageV1n,
        reactivePowerVar1,
        powerFactorT,
        currentDemandDa3,
        voltageV2n,
        reactivePowerVar2,
        frequencyHz,
        currentA1,
        currentDemandDan,
        voltageV3n,
        reactivePowerVar3,
        harmonicCurrentHiT,
        currentA2,
        currentDemandDavg,
        voltageAverageVln,
        reactivePowerT,
        harmonicVoltageHvT,
        currentA3,
        voltageV12,
        activePowerW1,
        powerFactorPf1,
        currentAn,
        voltageV23,
        activePowerW2,
      } = req.body;

      const newPowerMetric: PowerMetric = await prisma.powerMetric.create({
        data: {
          machine: { connect: { id: machineId } },
          currentAvg,
          voltageV31,
          activePowerW3,
          powerFactorPf2,
          currentDemandDa1,
          voltageAverageVll,
          activePowerT,
          powerFactorPf3,
          currentDemandDa2,
          voltageV1n,
          reactivePowerVar1,
          powerFactorT,
          currentDemandDa3,
          voltageV2n,
          reactivePowerVar2,
          frequencyHz,
          currentA1,
          currentDemandDan,
          voltageV3n,
          reactivePowerVar3,
          harmonicCurrentHiT,
          currentA2,
          currentDemandDavg,
          voltageAverageVln,
          reactivePowerT,
          harmonicVoltageHvT,
          currentA3,
          voltageV12,
          activePowerW1,
          powerFactorPf1,
          currentAn,
          voltageV23,
          activePowerW2,
          timestamp: new Date(),
        },
        include: { machine: true },
      });

      res.status(201).json(newPowerMetric);
    } catch (error) {
      res.status(500).json({ error: "Unable to save Power Metric data" });
    }
  },

  // Fetch all Power Metrics
  async getAllPowerMetrics(req: Request, res: Response): Promise<void> {
    try {
      const powerMetrics: PowerMetric[] = await prisma.powerMetric.findMany({
        include: { machine: true },
      });
      res.status(200).json(powerMetrics);
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch Power Metric data" });
    }
  },

  // Fetch Power Metric by ID
  async getPowerMetricById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const powerMetric: PowerMetric | null =
        await prisma.powerMetric.findUnique({
          where: { id },
          include: { machine: true },
        });

      if (powerMetric) {
        res.status(200).json(powerMetric);
      } else {
        res.status(404).json({ error: "Power Metric not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch Power Metric data" });
    }
  },

  // Update Power Metric
  async updatePowerMetric(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedPowerMetric: PowerMetric = await prisma.powerMetric.update({
        where: { id },
        data: updateData,
        include: { machine: true },
      });

      res.status(200).json(updatedPowerMetric);
    } catch (error) {
      res.status(500).json({ error: "Unable to update Power Metric data" });
    }
  },

  // Delete Power Metric
  async deletePowerMetric(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await prisma.powerMetric.delete({
        where: { id },
      });
      if (result) {
        res.status(200).json({ message: "Power Metric deleted successfully" });
      } else {
        res.status(404).json({ error: "Power Metric not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Unable to delete Power Metric" });
    }
  },

  // Fetch Power Metrics by Machine
  async getPowerMetricsByMachine(req: Request, res: Response): Promise<void> {
    try {
      const { machineId } = req.params;
      const powerMetrics = await prisma.powerMetric.findMany({
        where: { machineId },
        orderBy: { timestamp: "desc" },
      });
      res.status(200).json(powerMetrics);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Unable to fetch Power Metrics by machine" });
    }
  },

  // Fetch Power Metrics by Date Range
  async getPowerMetricsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { machineId } = req.params;
      const { startDate, endDate } = req.query;
      const powerMetrics = await prisma.powerMetric.findMany({
        where: {
          machineId,
          timestamp: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        orderBy: { timestamp: "asc" },
      });
      res.status(200).json(powerMetrics);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Unable to fetch Power Metrics by date range" });
    }
  },

  // Calculate Daily Power Consumption Summary
  async calculateDailyPowerConsumption(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { machineId, date } = req.params;
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const powerMetrics = await prisma.powerMetric.findMany({
        where: {
          machineId,
          timestamp: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const dailySummary = powerMetrics.reduce(
        (acc, curr) => {
          acc.totalActivePower += curr.activePowerT;
          acc.totalReactivePower += curr.reactivePowerT;
          acc.count++;
          return acc;
        },
        { totalActivePower: 0, totalReactivePower: 0, count: 0 }
      );

      const averageActivePower =
        dailySummary.totalActivePower / dailySummary.count;
      const averageReactivePower =
        dailySummary.totalReactivePower / dailySummary.count;

      res.status(200).json({
        date,
        averageActivePower,
        averageReactivePower,
        totalReadings: dailySummary.count,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Unable to calculate daily power consumption summary" });
    }
  },

  // Fetch Latest Power Metric for All Machines
  async getLatestPowerMetricForAllMachines(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const machines = await prisma.machine.findMany({
        include: {
          powerMetrics: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
      });

      if (machines.length === 0) {
        res.status(404).json({ message: "No machine data found" });
        return;
      }

      const formattedResults = machines.map((machine) => ({
        name: machine.name,
        ...machine.powerMetrics[0],
      }));

      res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Error fetching latest power metrics:", error);
      res.status(500).json({
        error: "Unable to fetch latest Power Metrics for all machines",
      });
    }
  },

  async getFilteredPowerMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { productionLineId, machineId, startDate, endDate, mockSize } =
        req.query;

      // Check if mock data is requested
      if (mockSize) {
        const size = parseInt(mockSize as string, 10);
        const mockData = Array.from({ length: size }, (_, i) =>
          generateMockPowerMetric(i)
        );
        res.status(200).json(mockData);
        return;
      }

      // Build the where clause based on the provided filters
      const whereClause: any = {};

      if (productionLineId) {
        whereClause.machine = {
          productionLineId: productionLineId as string,
        };
      }

      if (machineId) {
        whereClause.machineId = machineId as string;
      }

      if (startDate && endDate) {
        whereClause.timestamp = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      const powerMetrics = await prisma.powerMetric.findMany({
        where: whereClause,
        include: {
          machine: {
            include: {
              productionLine: true,
            },
          },
        },
        orderBy: { timestamp: "desc" },
      });

      // Transform the data to match the desired format
      const formattedPowerMetrics = powerMetrics.map((metric) => ({
        current_avg: metric.currentAvg,
        voltage_v31: metric.voltageV31,
        active_power_w3: metric.activePowerW3,
        power_factor_pf2: metric.powerFactorPf2,
        id: metric.id,
        current_demand_da1: metric.currentDemandDa1,
        voltage_average_vll: metric.voltageAverageVll,
        active_power_t: metric.activePowerT,
        power_factor_pf3: metric.powerFactorPf3,
        current_demand_da2: metric.currentDemandDa2,
        voltage_v1n: metric.voltageV1n,
        reactive_power_var1: metric.reactivePowerVar1,
        power_factor_t: metric.powerFactorT,
        timestamp: metric.timestamp.toISOString(),
        current_demand_da3: metric.currentDemandDa3,
        voltage_v2n: metric.voltageV2n,
        reactive_power_var2: metric.reactivePowerVar2,
        frequency_hz: metric.frequencyHz,
        current_a1: metric.currentA1,
        current_demand_dan: metric.currentDemandDan,
        voltage_v3n: metric.voltageV3n,
        reactive_power_var3: metric.reactivePowerVar3,
        harmonic_current_hi_t: metric.harmonicCurrentHiT,
        current_a2: metric.currentA2,
        current_demand_davg: metric.currentDemandDavg,
        voltage_average_vln: metric.voltageAverageVln,
        reactive_power_t: metric.reactivePowerT,
        harmonic_voltage_hv_t: metric.harmonicVoltageHvT,
        current_a3: metric.currentA3,
        voltage_v12: metric.voltageV12,
        active_power_w1: metric.activePowerW1,
        power_factor_pf1: metric.powerFactorPf1,
        current_an: metric.currentAn,
        voltage_v23: metric.voltageV23,
        active_power_w2: metric.activePowerW2,
        status: {
          machine_id: metric.machineId,
          machine_name: metric.machine.name,
          group: 0, // You may need to add this field to your PowerMetric model
          metric_id: metric.id,
          id: 0, // You may need to add this field to your PowerMetric model
          status: 0, // You may need to add this field to your PowerMetric model
          description: "", // You may need to add this field to your PowerMetric model
        },
      }));

      res.status(200).json(formattedPowerMetrics);
    } catch (error) {
      console.error("Error fetching filtered power metrics:", error);
      res.status(500).json({
        error:
          "Unable to fetch Power Metrics based on the specified conditions",
      });
    }
  },
  async downloadCSVReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, machineId, mockSize } = req.query;

      let powerMetrics;

      if (mockSize) {
        // Generate mock data
        const size = parseInt(mockSize as string, 10);
        powerMetrics = Array.from({ length: size }, (_, i) =>
          generateMockPowerMetric(i)
        );
      } else {
        // Fetch real data from the database
        powerMetrics = await prisma.powerMetric.findMany({
          where: {
            machineId: machineId as string,
            timestamp: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          },
          include: {
            machine: {
              include: {
                productionLine: {
                  include: {
                    factory: {
                      include: {
                        company: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { timestamp: "asc" },
        });
      }

      // Prepare data for CSV
      const csvData = powerMetrics.map((metric) => ({
        timestamp: metric.timestamp,
        machineName: "Mock Machine",
        productionLine:
       "Mock Production Line",
        factory:
        "Mock Factory",
        company:
       
          "Mock Company",
        currentAvg: metric.currentAvg,
        voltageV31: metric.voltageV31,
        activePowerW3: metric.activePowerW3,
        powerFactorPf2: metric.powerFactorPf2,
        activePowerT: metric.activePowerT,
        reactivePowerT: metric.reactivePowerT,
        // Add more fields as needed
      }));

      // Convert to CSV
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(csvData);

      // Set response headers
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=power_metrics_report.csv"
      );

      // Send CSV file
      res.status(200).send(csv);
    } catch (error) {
      console.error("Error generating CSV report:", error);
      res.status(500).json({ error: "Unable to generate CSV report" });
    }
  },

  // Download PDF report
  async downloadPDFReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, machineId, mockSize } = req.query;

      let powerMetrics;

      if (mockSize) {
        // Generate mock data
        const size = parseInt(mockSize as string, 10);
        powerMetrics = Array.from({ length: size }, (_, i) =>
          generateMockPowerMetric(i)
        );
      } else {
        // Fetch real data from the database
        powerMetrics = await prisma.powerMetric.findMany({
          where: {
            machineId: machineId as string,
            timestamp: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          },
          include: {
            machine: {
              include: {
                productionLine: {
                  include: {
                    factory: {
                      include: {
                        company: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { timestamp: "asc" },
        });
      }

      // Create a new PDF document
      const doc = new PDFDocument();
      const filename = "power_metrics_report.pdf";

      // Set response headers
      res.setHeader(
        "Content-disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-type", "application/pdf");

      // Pipe the PDF document to the response
      doc.pipe(res);

      // Add content to the PDF
      doc.fontSize(18).text("Power Metrics Report", { align: "center" });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Report Period: ${startDate || "Mock"} to ${endDate || "Mock"}`);
      doc.moveDown();

      // Add company and machine information
      const machine ={
        name: "Mock Machine",
        productionLine: {
          name: "Mock Production Line",
          factory: {
            name: "Mock Factory",
            company: {
              name: "Mock Company",
            },
          },
        },
      }
      if (machine) {
        doc.text(
          `Company: ${
            machine.productionLine?.factory?.company?.name || "Mock Company"
          }`
        );
        doc.text(
          `Factory: ${machine.productionLine?.factory?.name || "Mock Factory"}`
        );
        doc.text(
          `Production Line: ${
            machine.productionLine?.name || "Mock Production Line"
          }`
        );
        doc.text(`Machine: ${machine.name || "Mock Machine"}`);
      } else {
        doc.text("Mock Data Report");
      }
      doc.moveDown();

      // Add table headers
      const tableTop = 200;
      const tableHeaders = [
        "Timestamp",
        "Current Avg",
        "Voltage V31",
        "Active Power T",
        "Reactive Power T",
      ];
      let tableY = tableTop;

      doc.font("Helvetica-Bold");
      tableHeaders.forEach((header, i) => {
        doc.text(header, 50 + i * 100, tableY);
      });

      // Add table rows
      doc.font("Helvetica");
      powerMetrics.forEach((metric, index) => {
        tableY = tableTop + 20 + index * 20;
        doc.text(metric.timestamp.toString(), 50, tableY);
        doc.text(metric.currentAvg.toString(), 150, tableY);
        doc.text(metric.voltageV31.toString(), 250, tableY);
        doc.text(metric.activePowerT.toString(), 350, tableY);
        doc.text(metric.reactivePowerT.toString(), 450, tableY);

        // Add a new page if needed
        if (tableY > 700) {
          doc.addPage();
          tableY = 50;
          doc.font("Helvetica-Bold");
          tableHeaders.forEach((header, i) => {
            doc.text(header, 50 + i * 100, tableY);
          });
          doc.font("Helvetica");
        }
      });

      // Finalize the PDF and end the stream
      doc.end();
    } catch (error) {
      console.error("Error generating PDF report:", error);
      res.status(500).json({ error: "Unable to generate PDF report" });
    }
  },
};

export default powerMetricController;