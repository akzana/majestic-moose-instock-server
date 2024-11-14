import * as inventoryController from "../controllers/inventory-controller.js";
import express from "express";
const router = express.Router();

router.route("/inventories").get(inventoryController.listAll);

export default router;