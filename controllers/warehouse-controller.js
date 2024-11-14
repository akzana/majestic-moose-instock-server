import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

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

export { addWarehouse };