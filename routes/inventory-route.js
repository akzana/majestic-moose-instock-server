import * as inventoryController from "../controllers/inventory-controller.js";
import express from "express";
const router = express.Router();

router
    .route("/inventories")
    .get(inventoryController.listAll);

router
    .route("/inventories/:id")
    .get(inventoryController.listOne);

export default router;