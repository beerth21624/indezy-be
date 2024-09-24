import express from "express";
import sparePartController from "../controllers/sparePartController";

const router = express.Router();

router.get("/", sparePartController.getAllSpareParts);
router.get("/filtered", sparePartController.getFilteredSpareParts);
router.get("/low-stock", sparePartController.getLowStockSpareParts);
router.get("/machine/:machineId", sparePartController.getSparePartsByMachine);
router.get("/:id", sparePartController.getSparePartById);

router.post("/", sparePartController.createSparePart);
router.post("/:id/replace", sparePartController.recordSparePartReplacement);

router.put("/:id", sparePartController.updateSparePart);
router.patch("/:id/quantity", sparePartController.updateSparePartQuantity);

router.delete("/:id", sparePartController.deleteSparePart);

export default router;
