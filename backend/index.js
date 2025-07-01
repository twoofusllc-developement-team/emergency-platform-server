const express = require('express')
const app = express()
const DB = require("./database").connectDB;

require('dotenv').config();
DB();
app.use(express.json())

const facilityRoutes = require('./routes/facilitiesRoutes');
const bookingRoutes = require('./routes/BookingRoutes')
const offeringRoutes = require('./routes/offeringRoutes')

app.use(`api/${process.env.API_VERSION}/shelter`, facilityRoutes)

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})