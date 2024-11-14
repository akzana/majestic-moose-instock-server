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

const listOne = async (req, res) => {
  try {
    const foundWarehouse = await knex("warehouses").where({
      id: req.params.id,
    });

    if (foundWarehouse.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found. Please try again.`,
      });
    }

    const foundWarehouseData = foundWarehouse.map((warehouse) => ({
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
    res.status(200).json(foundWarehouseData);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

const validPhoneNumber = (phone) => {
    let startIndex = 0;
    if (phone.startsWith('+1')) {
        startIndex = 2;
    }

    let digitCount = 0;

    for (let i = startIndex; i < phone.length; i++) {
        const char = phone[i];
        if (!isNaN(char) && char !== ' ') {
            digitCount++;
        }
        else if (char === '(' || char === ')' || char === '-' || char === ' ') {
            continue;
        }
        else {
            return false;
        }
    }
    return digitCount === 10;
};

const isValidEmail = (email) => {
    const atSymbolIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");

    return (
        atSymbolIndex > 0 &&
        dotIndex > atSymbolIndex + 1 &&
        dotIndex < email.length - 1
    );
};

const addWarehouse = async (req, res) => {
    const {
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
    } = req.body;

    if (
        !warehouse_name ||
        !address ||
        !city ||
        !country ||
        !contact_name ||
        !contact_position ||
        !contact_phone ||
        !contact_email
    ) {
        return res.status(400).json({
            message: "Please provide all required fields for the warehouse",
        });
    }

    if (!validPhoneNumber(contact_phone)) {
        return res.status(400).json({
            message: "Invalid phone number. Please use format: +1 (XXX) XXX-XXXX or (XXX) XXX-XXXX",
        });
    }

    if (!isValidEmail(contact_email)) {
        return res.status(400).json({
            message: "Please provide a valid email address",
        });
    }

    try {
        const result = await knex("warehouses").insert(req.body);
        const newWarehouseId = result[0];

        const createdWarehouse = await knex("warehouses").where({
            id: newWarehouseId,
        });

        res.status(201).json(createdWarehouse[0]);
    } catch (error) {
        res.status(500).json({
            message: `Unable to create new warehouse: ${error}`,
        });
    }
};

export { listAll, listOne, addWarehouse };
