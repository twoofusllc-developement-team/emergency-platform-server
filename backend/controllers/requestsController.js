const Facility = require('../models/facilityModel')
const Person = require('../models/PersonSchema')

exports.createRequest = async (req, res) => {
    try{
        const facilityID = req.params.id
        const {
            RequestType,
            RequestName
        } = req.body;

        const requester = req.person
        if (!requester){
            return res.status(404).json({message:"Requester not found!"})
        }

        if (RequestType === "Request Shelter") {
            if (requester.ShelterOwnerProfile) {
                return res.status(400).json({ message: "Shelter owners cannot request shelters." });
            }

            const shelter = await Facility.findById(facilityID)
            if(!shelter){
                return res.status(404).json({message: "Shelter is not found!"})
            }
            if (!shelter.ShelterProfile.isAvailable){
                return res.status(400).json({message: "Shelter is already been booked by someone else!"})
            }
            const now= Date.now()
            if (now < shelter.AvailableFrom || now > shelter.AvailableTo){
                return res.status(400).json({message: "Shelter is not available in such time!"})
            }

            const newRequest = new Request({
                RequestType,
                RequestName,
                RequestShelter:{
                    shelterID:facilityID
                }
            });

            await newRequest.save();

            return res.status(201).json({ message: "Request submitted successfully."});
        }

        else if (RequestType === "Request Blood"){
             if (!RequestBlood || !RequestBlood.BloodType) {
                return res.status(400).json({ message: "BloodType is required for 'Request Blood'." });
            }
            const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
            if (!validBloodTypes.includes(RequestBlood.BloodType)){
                return res.status(400).json({message: "Blood type is not valid!"})
            }
            if (RequestBlood.quantity<0){
                return res.status(400).json({message: "Quantity should be positive!"})
            }
            const hospital= RequestBlood.hospital
            if (!hospital){
                return res.status(404).json({message: "Hospital details are required!"})
            }
            const contact = RequestBlood.contact
            if(!contact){
                return res.status(400).json({message: "Contact info is required"})
            }

            const newRequest = new Request({
            RequesterID,
            RequestType,
            RequestName,
            RequestBlood:req.body["RequestBlood"]
            });

            await newRequest.save();

            return res.status(201).json({ message: "Request submitted successfully."});
            
        }

        else if (RequestType === "Request Mobility"){
            if(!RequestMobility || !RequestMobility.pickupLocation || !RequestMobility.dropoffLocation){
                return res.status(400).json({ message: "Address is required for 'Request Mobility'." });
            }
            const now = timeStamp()
            if (now>RequestMobility.pickupTime){
                return res.status(400).json({message: "Error! Time is in the past!"})
            }
            const contact = RequestMobility.contact
            if(!contact){
                return res.status(400).json({message: "Contact info is required"})
            }

            const newRequest = new Request({
                RequesterID,
                RequestType,
                RequestName,
                RequestMobility:req.body["RequestMobility"]
            });

            await newRequest.save();

            return res.status(201).json({ message: "Request submitted successfully."});
        }

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}