const Facility = require('../models/facilityModel')
const Person = require('../models/PersonSchema')

exports.createShelter = async (req, res) => {
    try{
        const user= await Person.findById(req.params.id)
        if (!user){
            return res.status(404).json({message:"User not found! Please try again!"})
        }
        if (!user.shelterOwnerProfile){
            return res.status(400).json({message:"You can't create a shelter unless you are an owner!"})
        }

        const {
            FacilityName,
            FacilityType,
            FacilityDescription,
            FacilityImages,
            FacilityAddress,
            ShelterProperties,
            isFurnished,
            capacity,
            isShared,
            isAvailable,
            AvailableFrom,
            AvailableTo
        } = req.body;

        const newShelter = new Facility({
            FacilityName,
            FacilityType,
            FacilityDescription,
            FacilityImages,
            FacilityAddress,
            ShelterProperties,
            isFurnished,
            capacity,
            isShared,
            isAvailable,
            AvailableFrom,
            AvailableTo,
            status:"pending"
        });

        await newShelter.save()
        
        return res.status(200).json({message:"Pending Verification!" + newShelter})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

exports.getShelters = async (req, res) => {
    try{
        console.log("hi")
        return res.status(200).json({message: "succesfull!"})
    }catch(err){
        return res.status(500).json({message: "error "+ err.message})
    }
}