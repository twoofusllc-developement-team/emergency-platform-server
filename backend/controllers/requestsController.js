const Shelter = require('../models/facilities')
const Person = require('../models/PersonSchema')

exports.createRequest = async (req, res) => {
    try{
        
        const {
            RequesterID,
            RequestType,
            RequestName
        } = req.body;

        const requester = await Person.findById(RequesterID)
        if (!requester){
            return res.status(404).json({message:"Requester not found!"})
        }

        if (RequestType === "Request Shelter") {
            if (!RequestShelter || !RequestShelter.OfferingID) {
                return res.status(400).json({ message: "OfferingID is required for 'Request Shelter'." });
            }

            if (requester.ShelterOwnerProfile) {
                return res.status(400).json({ message: "Shelter owners cannot request shelters." });
            }
            const newRequest = new Request({
                RequesterID,
                RequestType,
                RequestName,
                RequestShelter:req.body
            });

            await newRequest.save();

            return res.status(201).json({ message: "Request submitted successfully."});
        }

        if (RequestType === "Request Blood"){
             if (!RequestBlood || !RequestBlood.BloodType) {
                return res.status(400).json({ message: "BloodType is required for 'Request Blood'." });
            }

            //i should add the handler that checks if requester isnot donor

            const newRequest = new Request({
            RequesterID,
            RequestType,
            RequestName,
            RequestBlood:req.body
            });

            await newRequest.save();

            return res.status(201).json({ message: "Request submitted successfully."});
            
        }

        if (RequestType === "Request Mobility"){
             const newRequest = new Request({
                RequesterID,
                RequestType,
                RequestName,
                RequestMobility:req.body
            });

            await newRequest.save();

            return res.status(201).json({ message: "Request submitted successfully."});
        }

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}