const Booking = require("../models/BookingSchema");
const Person = require("../models/PersonSchema");
    const validTypes = ['shelter', 'blood', 'mobility'];
const successResponse = (data, statusCode, message, res) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};


const failedResponse = (statusCode, message, res) => {
  res.status(statusCode).json({
    success: false,
    message: message,
    data: null,
  });
};
exports.createOffer = (req , res) =>{
  try {
    const { Type } = req.body;
    if (!Type) {
      return res.status(400).json({ error: 'Type is required' });
    }
     if (!validTypes.includes(Type)) {
      return res.status(400).json({ error: 'Invalid offer type' });
    }
    const newOffer = new Offer({ Type });
     newOffer.save();
    res.status(201).json(newOffer);

  } catch (error) {
    console.error(error);
     res.status(500).json({ error: 'Server error' });
    
  }


};

