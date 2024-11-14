import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const listAll = async (_req, res) => {
    try {
        const allData = await knex('inventories')
            .join('warehouses', 'inventories.warehouse_id', '=', 'warehouses.id')
            .select('inventories.*', 'warehouses.warehouse_name');
        const inventoryData = allData.map((inventory) => ({
            id: inventory.id,
            warehouse_name: inventory.warehouse_name,
            item_name: inventory.item_name,
            category: inventory.category,
            status: inventory.status,
            quantity: inventory.quantity
        }));
        res
            .status(200)
            .json(inventoryData);
    } catch (err) {
        res
            .status(500)
            .send(`Server error retrieving inventories`);
        console.error("Error getting list of all inventorys:", err);
    }
};

export { listAll };