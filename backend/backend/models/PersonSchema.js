const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
 const validator = require('validator');
const PersonSchema = new Schema({
    "email" : {
        type : String ,
        required :[true , "email is required"],
        trim : true ,
        unique : true ,
        maxLength : 150 ,
        lowercase : true ,
    },
    "passwordHash": {
         type : String,
         required : true
    },
     "role": {
        type : String ,
        enum : ["Shelter Owner","requester","admin"],
        required: true
     },
       "PhoneNumber": {
        type : String ,

       },
        "address": [addressSchema],
        "shelterOwnerProfile": shelterOwnerProfileSchema,
  "requesterProfile": requesterProfileSchema,
  "createdAt": {
    type: Date,
    default: Date.now
  },
  'tenantId': {
    type: Schema.Types.ObjectId,
    ref: 'Tenant'
  },
  'isDeleted': {
    type: Boolean,
    default: false
  },
  'deletedAt': {
    type: Date
  }
  });
  const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
