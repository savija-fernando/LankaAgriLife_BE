const router=require("express").Router();
const { error } = require("console");
let Revenue=require("../models/revenue");
const { Router } = require("express");

router.route("/add").post((req,res)=>{ //when inserting we use post (request and respond)
    //getting the the values using request
    const revenue_id=req.body.revenue_id;
    const salesData=Number(req.body.salesData);
    const expenseData=Number(req.body.expenseData);
    const profit=Number(req.body.profit);
    const rsupervisor_id=req.body.supervisor_id;



    //sending data to database or create objects from schema
    const newRevenue= new Revenue({
        revenue_id,
        salesData,
        expenseData,
        profit,
        rsupervisor_id
    });
    //saving to Database
    newRevenue.save().then(()=>{
        res.json("Revenue item added!");
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json("Error:"+error);
    });
});//http://localhost:8070/Revenue
    //get all data
    router.route("/").get((req,res)=>{
        Revenue.find().then((revenues)=>{
            res.json(revenues)
        }).catch((error)=>{
            console.log(error)
        })
    });

//http//localhsot:8070/Revenue/update/
    router.route("/update/:id").put(async (req, res) => {
    // Extract inventory_id from the URL
    let revenueId = req.params.id;

    // Destructure request 
    const {revenue_id, salesData, expenseData, profit, rsupervisor_id} = req.body;

    // Build update object
    const updateRevenue = {
        revenue_id,
        salesData,
        expenseData,
        profit,
        rsupervisor_id
    };

    try {
        // Use custom field in the query
        const update = await Revenue.findOneAndUpdate(
            { revenue_id: revenueId }, 
            updateRevenue,
            { new: true }  //return the updated doc
        );
            if (!update) {
            return res.status(404).json({ message: "Revenue item not found" });
            }
            else
                res.status(200).json({ message: "Revenue updated successfully", data: update });

        } catch (error) {
             res.status(500).json({ message: "Error updating Revenue", error: error.message });
        }

    }); 
    //delete
    router.route("/delete/:id").delete(async(req,res)=>{
        let revenueId = req.params.id;

        try {
            const deletedItem = await Revenue.findOneAndDelete({ revenue_id: revenueId });

            if (!deletedItem) {
                return res.status(404).json({ message: "Revenue item not found" });
            }

            res.status(200).json({ message: "Revenue item deleted successfully", data: deletedItem });
            } catch (error) {
            res.status(500).json({ message: "Error deleting Revenue item", error: error.message });
            }
    })

    module.exports=router;  //its a must