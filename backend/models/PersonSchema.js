const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
 const validator = require('validator');
 const addressSchema = require("./addressSchema");
 const requesterProfileSchema =require("./requesterProfileSchema");
 const shelterOwnerProfileSchema = require("./shelterOwnerProfileSchema");
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
  // PersonSchema.pre(save(),async function (next) {
  //   try {
  //     if (!this.isModified("passwordHash")) {
  //       return next() ;
  //     }
  //     this.p
  //   } catch (error) {
  //     console.log(error);
      
  //   }
  // });
  PersonSchema.methods.checkPassword = async (
    candidatePassword  // enter by user
    , userPassword// save in db
     )=> {
    return await bcrypt.compare(candidatePassword,userPassword);
};
  const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
