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
        enum : ["ShelterOwner","requester","admin"],
        required: true
     },
       "PhoneNumber": {
        type : String ,

       },
      address: { 
        addressName: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
          default: 'Primary Address'
        },
        street: {
          type: String,
          trim: true,
          maxlength: 200
        },
    },
    // ask in the meet
  shelterOwnerProfile: { 
    shelterOwnerID: {
      type: Number,
    },
    // "Shelters": [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'Facility',
    //   default: []
    // }],
  },
  // ask here also
  requesterProfile:{
   Documents: {
    type: String,
  },
  } 
  ,
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
