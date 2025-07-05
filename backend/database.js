const mongoose= require('mongoose')
require("dotenv").config()

exports.connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("MongoDB connected!")
        
    }catch(e){
        console.error(e)
        process.exit(1)
    }
}