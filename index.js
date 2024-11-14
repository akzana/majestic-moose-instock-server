import "dotenv/config";
import express from "express";
import warehouseRoutes from "./routes/warehouse-route.js";

const app = express();

const PORT = process.env.PORT || 5050;

app.use(express.json());

app.use("/api/warehouses", warehouseRoutes);


app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
});