import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const listAll = async (_req, res) => {
  try {
    const allData = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select("inventories.*", "warehouses.warehouse_name", "warehouses.id");
    const inventoryData = allData.map((inventory) => ({
      id: inventory.id,
      warehouse_name: inventory.warehouse_name,
      warehouseId: inventory.warehouse_id,
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

/*
 * Update an existing iventory item
 */
const update = async (req, res) => {
  try {
    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;

    // If there is a missing property in the request body
    if (
      !warehouse_id ||
      !item_name ||
      !description ||
      !category ||
      !status ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message: "Missing properties.",
      });
    }

    // If the quantity is not a number
    if (typeof quantity !== "number") {
      return res.status(400).json({
        message: "Quantity should be a number.",
      });
    }

    // If the warehouse_id value does not exist
    const warehouseIdExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseIdExists) {
      return res.status(400).json({
        message: "Warehouse id does not exist.",
      });
    }

    const rowsUpdated = await knex("inventories")
      .where({ id: req.params.id })
      .update({
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity,
      });

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: "Inventory ID not found.",
      });
    }

    const updatedInventory = await knex("inventories")
      .where({ id: req.params.id })
      .first();

    res.status(200).json(updatedInventory);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to update inventory.",
    });
  }
};

const addItem = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    quantity === undefined
  ) {
    return res.status(400).json({
      message: `Please provide all required fields for the inventory item ${req.body}`,
    });
  }

  if (typeof quantity !== "number" || isNaN(quantity)) {
    return res.status(400).json({
      message: "Please ensure quantity is a valid number",
    });
  }

  try {
    const warehouseIdExists = await knex("warehouses")
      .where("id", warehouse_id)
      .first();
    if (!warehouseIdExists) {
      res.status(400).json({
        message: `Sorry, the warehouse ID ${warehouse_id} does not exist. Please verify the warehouse is added and try again.`,
      });
    }

    const result = await knex("inventories").insert(req.body);
    const itemId = result[0];

    const createdItem = await knex("inventories").where({
      id: itemId,
    });
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new inventory item: ${error}`,
    });
  }
};
export { listAll, listOne, update, addItem };
