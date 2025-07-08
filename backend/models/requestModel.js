const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  RequestID: {
    type: mongoose.Schema.Types.ObjectId
  },
  RequesterID: {
    type: mongoose.Schema.Types.ObjectId
  },
  RequestType: {
    type: String,
    enum: ['Request Shelter', 'Request Blood', 'Request Mobility']
  },
  RequestName: {
    type: String
  },
  RequestShelter: {
    shelterID: {
      type: mongoose.Schema.Facility.ObjectId
    }
  },
  RequestBlood: {
    BloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+']
    }
  },
  RequestMobility: {
    Address: {
      AddressName: {
        type: String
      }
    }
  }
});

module.exports = mongoose.model('Request', requestSchema);
