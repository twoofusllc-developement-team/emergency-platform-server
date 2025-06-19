const { Schema } = require('mongoose');
const requesterProfileSchema = new Schema({
  Requester: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Person' 
  },
   Documents: {
    type: String,
    required: true
  },
}, {
  timestamps: true 
});
module.exports = requesterProfileSchema;