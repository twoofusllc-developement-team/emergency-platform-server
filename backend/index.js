const express = require('express');
const app = express();
const DB = require('./database').connectDB;

DB()
app.use(express.json())

const personRouter = require('./routes/PersonRoutes'); 
app.use('/api/v1/persons', personRouter);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})