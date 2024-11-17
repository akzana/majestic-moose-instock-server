import * as inventoryController from "../controllers/inventory-controller.js";
import express from "express";
const router = express.Router();

router
    .route("/inventories")
    .get(inventoryController.listAll)
    .post(inventoryController.addItem);

router
    .route("/inventories/:id")
    .get(inventoryController.listOne)
    .put(inventoryController.update)
    .delete(inventoryController.deleteInventory);

export default router;