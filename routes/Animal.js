const router=require("express").Router();
const { error } = require("console");
let Animal=require("../models/animal");
const { Router } = require("express");

router.route("/add").post((req,res)=>{ //when inserting we use post
    //getting the the values using request
    const animal_id=req.body.animal_id;
    const species=req.body.species;
    const breedingDetails=req.body.breedingDetails;
    const feedingData=req.body.feedingData;
    const healthRecord=req.body.healthRecord;
    const dateOfBirth=new Date(req.body.dateOfBirth);

    //sending data to database or create objects from schema
    const newAnimal= new Animal({
        animal_id,
        species,
        breedingDetails,
        feedingData,
        healthRecord,
        dateOfBirth,
    });
    //saveing to Database
    newAnimal.save().then(()=>{
        res.json("Animal added!");
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json("Error:"+error);
    });
});