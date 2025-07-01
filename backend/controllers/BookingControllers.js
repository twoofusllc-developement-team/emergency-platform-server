const Booking = require("./../models/BookingSchema");
const Person = require("./../models/PersonSchema");
function isISODate(dateString) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

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
const validateData = (customerDetails,bookingDetails,paymentInfo)=>{
      const person =   Person.findOne({name , email , phone});
    if (!customerDetails ||
        !customerDetails.name ||
        !customerDetails.phone ||
        !/^\d{10}$/.test(customerDetails.phone) ||
        !customerDetails.email ||
        !/^\S+@\S+\.\S+$/.test(customerDetails.email) ||
        !paymentInfo   ||
        !paymentInfo.method ||
        !paymentInfo.amount ||
        !paymentInfo.currency ||
        !bookingDetails  ||
        !bookingDetails.date ||
        ! isISODate(bookingDetails.date) ||
        !bookingDetails.time ||
        !bookingDetails.serviceType ||
       !bookingDetails.specialRequests ||
       !person
    ) {
         return false;
    }
  
    else{
        return true;
    }
   


};
exports.createBooking = async (req ,res) => {
    const {customerDetails,bookingDetails,paymentInfo} = req.body;
    
    if (!validateData(customerDetails,bookingDetails,paymentInfo)) {
          return failedResponse(400, "Invalid or missing data.", res);
    }
    BookingData =  {customerDetails,bookingDetails,paymentInfo};
    const newBooking = new Booking(BookingData);
        await newBooking.save();
    return successResponse(BookingData, 201, "Booking creatre successfully.", res);
    
};