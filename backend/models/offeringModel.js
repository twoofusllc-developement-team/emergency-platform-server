const mongoose = require('mongoose');

const offeringSchema = new mongoose.Schema({
  Type: {
    type: String,
    enum: ['shelter', 'blood', 'mobility']
  }
});

module.exports = mongoose.model('Offer', offeringSchema);
