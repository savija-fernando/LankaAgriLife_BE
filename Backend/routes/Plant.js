const router=require("express").Router();
const { error } = require("console");
let Plant=require("../models/plant");
const { Router } = require("express");

router.route("/add").post((req,res)=>{ //when inserting we use post
    //getting the the values using request
    const crop_id=req.body.crop_id;
    const plantingDate=Date(req.body.dateAdded);
    const type=req.body.type;
    const location=req.body.location;
    const harvestDate=Date(req.body.dateAdded);
    const waterIntake=req.body.waterIntake;
    const fertilizerIntake=req.body.fertilizerIntake;
    const employee_id=req.body.employee_id;

    //sending data to database or create objects from schema
    const newPlant = new Plant({
        crop_id,
        plantingDate,
        type,
        location,
        harvestDate,
        waterIntake,
        fertilizerIntake,
        employee_id
    });
    //saveing to Database
    newPlant.save().then(()=>{
        res.json("Plant is added!");
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json("Error:"+error);
    });
});
//http//localhost:8070/Plant
    //get all data
    router.route("/").get((req,res)=>{
        Plant.find().then((plants)=>{
            res.json(plants)
        }).catch((error)=>{
            console.log(error)
        })
    });
//http//localhsot:8070/Inventory/update/
    router.route("/update/:id").put(async(req,res)=>{  //:id fetching the id part using url and put using for update
        let crop_id=req.params.id;

    }) 

    module.exports=router;  //its a must