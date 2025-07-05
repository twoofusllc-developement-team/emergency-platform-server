const express = require('express')
const app = express()
const DB = require("./database").connectDB;

require('dotenv').config();
DB();
app.use(express.json())

const personRoutes = require('./routes/PersonRoutes')
const facilityRoutes = require('./routes/facilitiesRoutes');
const bookingRoutes = require('./routes/BookingRoutes')
const offeringRoutes = require('./routes/offeringRoutes')
const requestRoutes = require('./routes/requestRoutes')

app.use(`/api/${process.env.API_VERSION}/person`, personRoutes)
app.use(`/api/${process.env.API_VERSION}/facility`, facilityRoutes)
app.use(`/api/${process.env.API_VERSION}/booking`, bookingRoutes)
app.use(`/api/${process.env.API_VERSION}/offering`, offeringRoutes)
app.use(`/api/${process.env.API_VERSION}/request`, requestRoutes)

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})