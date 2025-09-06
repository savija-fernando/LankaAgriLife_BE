const express = require("express");
const router = express.Router();
const {
  addInventoryItem,
  getAllInventory,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
} = require("../controllers/inventoryController");

// POST /Inventory/add
router.post("/add", addInventoryItem);

// GET /Inventory
router.get("/", getAllInventory);

// PUT /Inventory/update/:id
router.put("/update/:id", updateInventoryItem);

// DELETE /Inventory/delete/:id
router.delete("/delete/:id", deleteInventoryItem);

// GET /Inventory/low-stock
router.get("/low-stock", getLowStockItems);

//GET /Inventory/export/pdf
const genaratePDF=require('../controllers/pdfController');
router.get('/export/pdf',genaratePDF);

module.exports = router;
