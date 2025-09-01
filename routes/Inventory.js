const router=require("express").Router();
const { error } = require("console");
let Inventory=require("../models/inventory");
const { Router } = require("express");

router.route("/add").post((req,res)=>{ //when inserting we use post
    //getting the the values using request
    const inventory_id=req.body.inventory_id;
    const itemName=req.body.itemName;
    const dateAdded=new Date(req.body.dateAdded);
    const expiryDate=new Date(req.body.expiryDate);
    const stockLevel=Number(req.body.stockLevel);
    const unitPrice=Number(req.body.unitPrice);

    //sending data to database or create objects from schema
    const newInventory= new Inventory({
        inventory_id,
        itemName,
        dateAdded,
        expiryDate,
        stockLevel,
        unitPrice
    });
    //saveing to Database
    newInventory.save().then(()=>{
        res.json("Inventory item added!");
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json("Error:"+error);
    });
});
//http//localhost:8070/Inventory
    //get all data
    router.route("/").get((req,res)=>{
        Inventory.find().then((inventories)=>{
            res.json(inventories)
        }).catch((error)=>{
            console.log(error)
        })
    });
//http//localhsot:8070/Inventory/update/
    router.route("/update/:id").put(async (req, res) => {
    // Extract inventory_id from the URL
    let inventoryId = req.params.id;

    // Destructure request 
    const { inventory_id, itemName, dateAdded, expiryDate, stockLevel, unitPrice } = req.body;

    // Build update object
    const updateInventory = {
        inventory_id,
        itemName,
        dateAdded,
        expiryDate,
        stockLevel,
        unitPrice
    };

    try {
        // Use custom field in the query
        const update = await Inventory.findOneAndUpdate(
            { inventory_id: inventoryId }, 
            updateInventory,
            { new: true }  //return the updated doc
        );
            if (!update) {
            return res.status(404).json({ message: "Inventory item not found" });
            }
            else
                res.status(200).json({ message: "Inventory updated successfully", data: update });

        } catch (error) {
             res.status(500).json({ message: "Error updating inventory", error: error.message });
        }

    }); 
    //delete
    router.route("/delete/:id").delete(async(req,res)=>{
        let inventoryId = req.params.id;

        try {
            const deletedItem = await Inventory.findOneAndDelete({ inventory_id: inventoryId });

            if (!deletedItem) {
                return res.status(404).json({ message: "Inventory item not found" });
            }

            res.status(200).json({ message: "Inventory item deleted successfully", data: deletedItem });
            } catch (error) {
            res.status(500).json({ message: "Error deleting inventory item", error: error.message });
            }
    })

    module.exports=router;  //its a must





    
