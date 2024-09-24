
import express from "express";
import companyController from "../controllers/companyController";
import { cacheMiddleware, clearCache } from "../middleware/redisMiddleware";

const router = express.Router();

console.log("getAllCompanies");

router.post("/", async (req, res, next) => {
  await companyController.createCompany(req, res);
  clearCache(["/companies"]); // Clear cache for getAllCompanies
  next();
});

router.get("/", cacheMiddleware(60), companyController.getAllCompanies);
router.get("/:id", cacheMiddleware(60), companyController.getCompanyById);

router.put("/:id", async (req, res, next) => {
  await companyController.updateCompany(req, res);
  clearCache(["/companies", `/companies/${req.params.id}`]);
  next();
});

router.delete("/:id", async (req, res, next) => {
  await companyController.deleteCompany(req, res);
  clearCache(["/companies", `/companies/${req.params.id}`]);
  next();
});

export default router;
