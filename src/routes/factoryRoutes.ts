import express from "express";
import factoryController from "../controllers/factoryController";

const router = express.Router();

router.post("/", factoryController.createFactory);
router.get("/", factoryController.getAllFactories);
router.get("/:id", factoryController.getFactoryById);
router.put("/:id", factoryController.updateFactory);
router.delete("/:id", factoryController.deleteFactory);
router.get(
  "/:id/production-lines",
  factoryController.getFactoryProductionLines
);
router.get("/company/:companyId", factoryController.getFactoriesByCompany);

export default router;
