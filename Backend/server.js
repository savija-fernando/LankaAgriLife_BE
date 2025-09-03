const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");    // assigning variables

dotenv.config();
const app=express();

const PORT = process.env.PORT || 8070 

// middlewares
app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;  // access the database

// mongoose connection 
mongoose.connect(URL)
    .then(() => console.log("MongoDB Connection success!"))
    .catch((err) => console.error("MongoDB connection error:", err));


//const InventoryRouter=require("./routes/Inventory");
//app.use("/Inventory",InventoryRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});