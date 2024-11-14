import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/warehouses")
    .get(warehouseController.listAll)
    .post(warehouseController.addWarehouse);

export default router;
