const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  FacilityName: {
    type: String,
    required: true
  },
  facilityType: {
    type: [String],
    required: true,
    enum: ["Hospital", "NGO", "Shelter"]
  },
  FacilityDescription: {
    type: String
  },
  FacilityImages: [
    {
        type: String
    }
  ],
  FacilityAddress: {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], 
        required: true
      }
    },
    address: {
      type: String,
      required: true
    }
  },
  ShelterProfile: {
    ShelterProperties: [
      {
        type: String
      }
    ],
    isFurnished: {
      type: Boolean,
      default: false
    },
    capacity: {
      type: Number,
      min: 0
    },
    isShared: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    AvailableFrom: {
      type: Date
    },
    AvailableTo: {
      type: Date
    }
  },
  status:{
    type:String,
    enum:["pending", "verified"]
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Facility', facilitySchema);
