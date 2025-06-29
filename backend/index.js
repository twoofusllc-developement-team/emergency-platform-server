const express = require('express')
const app = express()
const DB = require("./database").connectDB;

require('dotenv').config();
DB();
app.use(express.json())

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})