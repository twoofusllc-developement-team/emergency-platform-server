const { Schema } = require('mongoose');

const addressSchema = new Schema({
  addressName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    default: 'Primary Address'
  },
  street: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
}, {
  timestamps: true, 
 
});


module.exports = addressSchema;