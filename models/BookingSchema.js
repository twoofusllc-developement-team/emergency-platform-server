const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
  requesterID: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  requestTypeID: {
    type: Schema.Types.ObjectId,
    ref: 'RequestType',
    required: true
  },
  offeringID: {
    type: Schema.Types.ObjectId,
    ref: 'Offering',
    required: true
  },
  availableFrom: {
    type: Date,
    required: true,

  },
  availableTo: {
    type: Date,
    required: true,
   
  },
  reservedCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  bookedCount: {
    type: Number,
    default: 0,
    min: 0,
   
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'declined', 'canceled', 'completed', 'no-show'],
    default: 'pending',
    required: true
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: 200
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  confirmedAt: {
    type: Date
  },
  canceledAt: {
    type: Date
  }
}, {
  timestamps: true
  
});





module.exports = mongoose.model("Booking",BookingSchema);