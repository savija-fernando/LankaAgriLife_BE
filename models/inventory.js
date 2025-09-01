const mongoose=require('mongoose');

const inventorySchema = new mongoose.Schema({
    inventory_id: {
        type: String,
        required: true,
        unique: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    dateAdded: {
        type: Date,
        
    },
    expiryDate: {
        type: Date
    },
    stockLevel: {
        type: Number,
        required: true,
        min: 0
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true   // adds createdAt & updatedAt automatically
});

// Create model
const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;

