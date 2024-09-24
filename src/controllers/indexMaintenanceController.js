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
exports.removeUnusedIndexes = exports.checkIndexPerformance = exports.updateStatistics = exports.reorganizeIndex = exports.rebuildAllIndexes = void 0;
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma = new client_1.PrismaClient();
// Rebuild all indexes
exports.rebuildAllIndexes = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // This is a placeholder. Actual implementation depends on your database system.
            // For PostgreSQL, you might use:
            yield prisma.$executeRaw `REINDEX DATABASE ${process.env.DATABASE_NAME}`;
            res.status(200).json({ message: "All indexes rebuilt successfully" });
        }
        catch (error) {
            console.error("Error rebuilding indexes:", error);
            res.status(500).json({ error: "Failed to rebuild indexes" });
        }
    }),
];
// Reorganize specific index
exports.reorganizeIndex = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { tableName, indexName } = req.params;
        try {
            // This is a placeholder. Actual implementation depends on your database system.
            // For SQL Server, you might use:
            // await prisma.$executeRaw`ALTER INDEX ${indexName} ON ${tableName} REORGANIZE`;
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
    }),
];
// Update statistics
exports.updateStatistics = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // This is a placeholder. Actual implementation depends on your database system.
            // For PostgreSQL, you might use:
            yield prisma.$executeRaw `ANALYZE`;
            res.status(200).json({ message: "Statistics updated successfully" });
        }
        catch (error) {
            console.error("Error updating statistics:", error);
            res.status(500).json({ error: "Failed to update statistics" });
        }
    }),
];
// Check index performance
exports.checkIndexPerformance = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const performanceData = yield gatherIndexPerformanceData();
            res.status(200).json(performanceData);
        }
        catch (error) {
            console.error("Error checking index performance:", error);
            res.status(500).json({ error: "Failed to check index performance" });
        }
    }),
];
// Remove unused indexes
exports.removeUnusedIndexes = [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.isAdmin,
    authMiddleware_1.isActive,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const unusedIndexes = yield identifyUnusedIndexes();
            for (const index of unusedIndexes) {
                yield prisma.$executeRaw `DROP INDEX IF EXISTS ${index.name}`;
            }
            res.status(200).json({
                message: "Unused indexes removed successfully",
                removedIndexes: unusedIndexes,
            });
        }
        catch (error) {
            console.error("Error removing unused indexes:", error);
            res.status(500).json({ error: "Failed to remove unused indexes" });
        }
    }),
];
// Helper function to gather index performance data (placeholder)
const gatherIndexPerformanceData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Implement logic to gather index performance data
    // This might involve querying system tables or using database-specific tools
    return { message: "Index performance data would be returned here" };
});
// Helper function to identify unused indexes (placeholder)
const identifyUnusedIndexes = () => __awaiter(void 0, void 0, void 0, function* () {
    // Implement logic to identify unused indexes
    // This might involve analyzing index usage statistics
    return [{ name: "example_unused_index" }];
});
