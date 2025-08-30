const router=require("express").Router();
const { error } = require("console");
let Inventory=require("../models/inventory");

router.route("/add").post((req,res)=>{ //when inserting we use post
    //getting the the values using request
    const inventory_id=req.body.inventory_id;
    const itemName=req.body.itemName;
    const dateAdded=Date(req.body.dateAdded);
    const expiryDate=Date(req.body.expiryDate);
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
    })
    //saveing to Database
    newInventory.save().then(()=>{
        res.json("Inventory item added!");
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json("Error:"+error);
    })

    module.exports=router;  //its a must



    
})  