const Shelter = require('../models/facilities')
const Person = require('../models/PersonSchema')

exports.createShelter = async (req, res) => {
    try{

        const user= await Person.findById(req.params.id)
        if (!user){
            return res.status(404).json({message:"User not found! Please try again!"})
        }
        if (user.ShelterOwnerProfile == null){
            return res.status(400).json({message:"You can't create a shelter unless you are an owner!"})
        }

        const {
            FacilityName,
            facilityType,
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

        const newShelter = new Shelter({
            owner: user._id,
            FacilityName,
            facilityType,
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
        });

        await newShelter.save()

        return res.status(200).json({message:"Shelter created successfully!"})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

