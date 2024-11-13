import * as warehouseController from "../controllers/warehouse-controller.js";
import express from "express";
const router = express.Router();

router.route("/warehouses").get(warehouseController.listAll);

export default router;
