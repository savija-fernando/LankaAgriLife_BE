const router=require("express").Router();
const { error } = require("console");
let Revenue=require("../models/revenue");
const { Router } = require("express");

router.route("/add").post((req,res)=>{ //when inserting we use post
    //getting the the values using request
    const revenue_id=req.body.revenue_id;
    const salesData=Number(req.body.salesData);
    const expenseData=Number(req.body.expenseData);
    const profit=Number(req.body.profit);
    const supervisor_id=req.body.supervisor_id;



    //sending data to database or create objects from schema
    const newRevenue= new Revenue({
        revenue_id,
        salesData,
        expenseData,
        profit,
        supervisor_id
    });
    //saveing to Database
    newRevenue.save().then(()=>{
        res.json("Revenue item added!");
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json("Error:"+error);
    });
});
//http//localhost:8070/Revenue
    //get all data
    router.route("/").get((req,res)=>{
        Revenue.find().then((revenue)=>{
            res.json(revenue)
        }).catch((error)=>{
            console.log(error)
        })
    });
//http//localhsot:8070/Revenue/update/
    router.route("/update/:id").put(async(req,res)=>{  //:id fetching the id part using url and put using for update
        let userId=req.params.id;

    }) 

    module.exports=router;  //its a must