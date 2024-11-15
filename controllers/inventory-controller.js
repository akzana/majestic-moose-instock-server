import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const listAll = async (_req, res) => {
  try {
    const allData = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select("inventories.*", "warehouses.warehouse_name");
    const inventoryData = allData.map((inventory) => ({
      id: inventory.id,
      warehouse_name: inventory.warehouse_name,
      item_name: inventory.item_name,
      category: inventory.category,
      status: inventory.status,
      quantity: inventory.quantity,
    }));
    res.status(200).json(inventoryData);
  } catch (err) {
    res.status(500).send(`Server error retrieving inventories`);
    console.error("Error getting list of all inventorys:", err);
  }
};

const listOne = async (req, res) => {
  try {
    const allData = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select("inventories.*", "warehouses.warehouse_name");

    const inventoryData = allData.map((inventory) => ({
      id: inventory.id,
      warehouse_name: inventory.warehouse_name,
      item_name: inventory.item_name,
      description: inventory.description,
      category: inventory.category,
      status: inventory.status,
      quantity: inventory.quantity,
    }));

    const foundItem = inventoryData.find(
      (item) => item.id === Number(req.params.id)
    );
    if (foundItem) {
      res.status(200).json(foundItem);
    } else {
      res
        .status(404)
        .json({ message: `Item with ID ${req.params.id} not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ Message: "Server error getting inventory item" });
  }
};

export { listAll, listOne };
