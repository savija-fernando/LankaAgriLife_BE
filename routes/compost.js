const router=require("express").Router();
const { error } = require("console");
let compost=require("../models/Compost");
const { Router } = require("express");
const Compost = require("../models/Compost");

router.route("/add").post((req,res)=>{ //when inserting we use post
    //getting the the values using request
    const compost_id=req.body.compost_id;
    const quantity=Number(req.body.quantity);
    const fermentingDate=Date(req.body.fermentingDate);
    const employee_id  =req.body.employee_id;
    const waste_id=req.body.waste_id;
    const inventory_id=req.body.inventory_id;
   

    //sending data to database or create objects from schema
    const newCompost= new Compost({
        compost_id,
        quantity,
        fermentingDate,
        employee_id,
        waste_id,
        inventory_id
    });
    //saveing to Database
    newInventory.save().then(()=>{
        res.json("Compost item added!");
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json("Error:"+error);
    });
});
//http//localhost:8070/Compost
    //get all data
    router.route("/").get((req,res)=>{
        compost.find().then((Compost)=>{
            res.json(Compost)
        }).catch((error)=>{
            console.log(error)
        })
    });
//http//localhsot:8070/Inventory/update/
    router.route("/update/:id").put(async(req,res)=>{  //:id fetching the id part using url and put using for update
        let userId=req.params.id;

    }) 

    module.exports=router;  //its a must