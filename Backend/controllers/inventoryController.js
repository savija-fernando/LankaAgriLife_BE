const Inventory = require("../models/inventory");

// Add inventory item
const addInventoryItem = async (req, res) => {
  //getting the the values using request
    const inventory_id=req.body.inventory_id;
    const itemName=req.body.itemName;
    const dateAdded=new Date(req.body.dateAdded);
    const expiryDate=new Date(req.body.expiryDate);
    const stockLevel=Number(req.body.stockLevel);
    const unitPrice=Number(req.body.unitPrice);

    try {
    //  Check for duplicate inventory_id
    const existingItem = await Inventory.findOne({ inventory_id });

    if (existingItem) {
      return res.status(409).json({ message: `Inventory item with ID ${inventory_id} already exists.` });
    }

    //sending data to database or create objects from schema
    const newInventory= new Inventory({
        inventory_id,
        itemName,
        dateAdded,
        expiryDate,
        stockLevel,
        unitPrice
    });

    await newInventory.save();
    res.json("Inventory item added!");
  } catch (error) {
    console.error(error);
    res.status(500).json("Error: " + error);
  }
};

// Get all inventory items
const getAllInventory = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.json(inventories);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error: " + error);
  }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
  const inventoryId = req.params.id;
  const { inventory_id, itemName, dateAdded, expiryDate, stockLevel, unitPrice } = req.body;

  const updateInventory = {
    inventory_id,
    itemName,
    dateAdded,
    expiryDate,
    stockLevel,
    unitPrice,
  };

  try {
    const updatedItem = await Inventory.findOneAndUpdate(
      { inventory_id: inventoryId },
      updateInventory,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json({ message: "Inventory updated successfully", data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory", error: error.message });
  }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
  const inventoryId = req.params.id;

  try {
    const deletedItem = await Inventory.findOneAndDelete({ inventory_id: inventoryId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json({ message: "Inventory item deleted successfully", data: deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory item", error: error.message });
  }
};

// Get low-stock items
const getLowStockItems = async (req, res) => {
  try {
    const lowStock = await Inventory.find({ $expr: { $lt: ["$stockLevel", "$threshold"] } });
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addInventoryItem,
  getAllInventory,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
};
