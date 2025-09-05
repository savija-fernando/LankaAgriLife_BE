const router=require("express").Router();
const { error } = require("console");
let Plant=require("../models/plant");
const { Router } = require("express");

router.route("/add").post((req,res)=>{ //when inserting we use post
    //getting the the values using request
    const crop_id=req.body.crop_id;
    const plantingDate = new Date(req.body.plantingDate);
    const type=req.body.type; 
    const location=req.body.location;
    const harvestDate = new Date(req.body.harvestDate);
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
//http://localhost:8070/Plant
    //get all data
    router.route("/").get((req,res)=>{
        Plant.find().then((plants)=>{
            res.json(plants)
        }).catch((error)=>{
            console.log(error)
        })
    });
//http//localhsot:8070/Plant/update/
    router.route("/update/:id").put(async (req, res) => {
    // Extract plant_id from the URL
    let plantId = req.params.id;

    // Destructure request 
    const { crop_id, plantingDate, type, location, harvestDate, waterIntake, fertilizerIntake, employee_id} = req.body;

    // Build update object
    const updatePlant = {
        crop_id,
        plantingDate,
        type,
        location,
        harvestDate,
        waterIntake,
        fertilizerIntake,
        employee_id
    };

    try {
        // Use custom field in the query
        const update = await Plant.findOneAndUpdate(
            { crop_id: plantId }, 
            updatePlant,
            { new: true }  //return the updated doc
        );
            if (!update) {
            return res.status(404).json({ message: "Plant not found" });
            }
            else
                res.status(200).json({ message: "Plant updated successfully", data: update });

        } catch (error) {
             res.status(500).json({ message: "Error updating plant", error: error.message });
        }

    }); 
    //delete
    router.route("/delete/:id").delete(async(req,res)=>{
        let plantId = req.params.id;

        try {
            const deletedItem = await Plant.findOneAndDelete({ crop_id: plantId });

            if (!deletedItem) {
                return res.status(404).json({ message: "Plant not found" });
            }

            res.status(200).json({ message: "Plant deleted successfully", data: deletedItem });
            } catch (error) {
            res.status(500).json({ message: "Error deleting plant", error: error.message });
    }
})

    module.exports=router; //its a must