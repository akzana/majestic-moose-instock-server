import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const listAll = async (_req, res) => {
  try {
    const allData = await knex("warehouses");
    const warehousesData = allData.map((warehouse) => ({
      id: warehouse.id,
      warehouse_name: warehouse.warehouse_name,
      address: warehouse.address,
      city: warehouse.city,
      country: warehouse.country,
      contact_name: warehouse.contact_name,
      contact_position: warehouse.contact_position,
      contact_phone: warehouse.contact_phone,
      contact_email: warehouse.contact_email,
    }));
    res.status(200).json(warehousesData);
  } catch (err) {
    res.status(500).send(`Server error retrieving Warehouses`);
    console.error("Error getting list of all warehouses:", err);
  }
};

export { listAll };
