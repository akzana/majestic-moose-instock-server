import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router
  .route("/warehouses")
  .get(warehouseController.listAll)
  .post(warehouseController.addWarehouse);

router
  .route("/warehouses/:id")
  .get(warehouseController.listOne)
  .delete(warehouseController.deleteWarehouse);

export default router;
