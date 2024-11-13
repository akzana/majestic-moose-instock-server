import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const listAll = async (req, res) => {
  try {
    const allData = await knex("warehouses");
    res.status(200).json(allData);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

export { listAll };
