const { Schema } = require('mongoose');

const shelterOwnerProfileSchema = new Schema({
  shelterOwnerID: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  "Shelters": [{
    type: Schema.Types.ObjectId,
    ref: 'Offering',
    default: []
  }],
}, {
  timestamps: true 
});
module.exports = shelterOwnerProfileSchema;
