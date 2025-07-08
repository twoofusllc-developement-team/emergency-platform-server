const mongoose = require('mongoose');
const { Schema } = mongoose;

const requestSchema = new mongoose.Schema({
  RequesterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  RequestType: {
    type: String,
    enum: ['Request Shelter', 'Request Blood', 'Request Mobility'],
    required: true
  },
  RequestName: {
    type: String,
    required: true
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamps for status changes
  statusUpdatedAt: {
    type: Date,
    default: Date.now
  },
  statusUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  },
  cancelledAt: {
    type: Date
  },
  adminNotes: {
    type: String
  },

  // Shelter-specific fields
  RequestShelter: {
    type: Schema.Types.ObjectId,
    ref: 'Facility',
    required: function() {
      return this.RequestType === 'Request Shelter';
    }
  },
  
  // Blood-specific fields
  RequestBlood: {
    BloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: function() {
        return this.RequestType === 'Request Blood';
      }
    },
    quantity: {
      type: Number,
      min: 1,
      required: function() {
        return this.RequestType === 'Request Blood';
      }
    },
    hospital: {
      name: {
        type: String,
        required: function() {
          return this.RequestType === 'Request Blood';
        }
      },
      address: {
        type: String,
        required: function() {
          return this.RequestType === 'Request Blood';
        }
      }
    },
    contact: {
      phone: {
        type: String,
        required: function() {
          return this.RequestType === 'Request Blood';
        }
      },
      email: String
    },
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  },
  
  // Mobility-specific fields
  RequestMobility: {
    pickupLocation: {
      address: {
        type: String,
        required: function() {
          return this.RequestType === 'Request Mobility';
        }
      },
      coordinates: [Number]
    },
    dropoffLocation: {
      address: {
        type: String,
        required: function() {
          return this.RequestType === 'Request Mobility';
        }
      },
      coordinates: [Number]
    },
    pickupTime: {
      type: Date,
      required: function() {
        return this.RequestType === 'Request Mobility';
      }
    },
    contact: {
      phone: {
        type: String,
        required: function() {
          return this.RequestType === 'Request Mobility';
        }
      },
      email: String
    },
    passengers: {
      type: Number,
      min: 1,
      default: 1
    },
    specialRequirements: String
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Request', requestSchema);