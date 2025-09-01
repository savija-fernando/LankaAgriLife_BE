const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");    // assigning variables

dotenv.config();  // load .env file

const app = express();

const PORT = process.env.PORT || 8070;   //if 8070 port is not there assign the available port number(process.env.PORT)

// middlewares
app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;  // access the database

// mongoose connection 
mongoose.connect(URL)
    .then(() => console.log("MongoDB Connection success!"))
    .catch((err) => console.error("MongoDB connection error:", err));

const CompostRouter=require("./routes/compost");
app.use("/compost",CompostRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});