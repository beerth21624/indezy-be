import express from "express";
import productionLineController from "../controllers/productionLineController";

const router = express.Router();

router.post("/", productionLineController.createProductionLine);
router.get("/", productionLineController.getAllProductionLines);
router.get("/:id", productionLineController.getProductionLineById);
router.put("/:id", productionLineController.updateProductionLine);
router.delete("/:id", productionLineController.deleteProductionLine);
router.get("/:id/machines", productionLineController.getProductionLineMachines);
router.get(
  "/factory/:factoryId",
  productionLineController.getProductionLinesByFactory
);

export default router;
