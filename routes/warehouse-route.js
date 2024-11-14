import express from "express";
const router = express.Router();
import { addWarehouse } from "../controllers/warehouse-controller.js";

router.route("/").post(addWarehouse);

export default router;