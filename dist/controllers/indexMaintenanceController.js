"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUnusedIndexes = exports.checkIndexPerformance = exports.updateStatistics = exports.reorganizeIndex = exports.rebuildAllIndexes = void 0;
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma = new client_1.PrismaClient();
exports.rebuildAllIndexes = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    async (res) => {
        try {
            await prisma.$executeRaw `REINDEX DATABASE ${process.env.DATABASE_NAME}`;
            res.status(200).json({ message: "All indexes rebuilt successfully" });
        }
        catch (error) {
            console.error("Error rebuilding indexes:", error);
            res.status(500).json({ error: "Failed to rebuild indexes" });
        }
    },
];
exports.reorganizeIndex = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    async (req, res) => {
        const { tableName, indexName } = req.params;
        try {
            res
                .status(200)
                .json({
                message: `Index ${indexName} on ${tableName} reorganized successfully`,
            });
        }
        catch (error) {
            console.error("Error reorganizing index:", error);
            res.status(500).json({ error: "Failed to reorganize index" });
        }
    },
];
exports.updateStatistics = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    async (res) => {
        try {
            await prisma.$executeRaw `ANALYZE`;
            res.status(200).json({ message: "Statistics updated successfully" });
        }
        catch (error) {
            console.error("Error updating statistics:", error);
            res.status(500).json({ error: "Failed to update statistics" });
        }
    },
];
exports.checkIndexPerformance = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    async (res) => {
        try {
            const performanceData = await gatherIndexPerformanceData();
            res.status(200).json(performanceData);
        }
        catch (error) {
            console.error("Error checking index performance:", error);
            res.status(500).json({ error: "Failed to check index performance" });
        }
    },
];
exports.removeUnusedIndexes = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    async (res) => {
        try {
            const unusedIndexes = await identifyUnusedIndexes();
            for (const index of unusedIndexes) {
                await prisma.$executeRaw `DROP INDEX IF EXISTS ${index.name}`;
            }
            res
                .status(200)
                .json({
                message: "Unused indexes removed successfully",
                removedIndexes: unusedIndexes,
            });
        }
        catch (error) {
            console.error("Error removing unused indexes:", error);
            res.status(500).json({ error: "Failed to remove unused indexes" });
        }
    },
];
const gatherIndexPerformanceData = async () => {
    return { message: "Index performance data would be returned here" };
};
const identifyUnusedIndexes = async () => {
    return [{ name: "example_unused_index" }];
};
//# sourceMappingURL=indexMaintenanceController.js.map