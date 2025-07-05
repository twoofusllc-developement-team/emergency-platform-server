const Person  = require("../models/PersonSchema");
const bcrypt = require('bcrypt');
const validator = require("validator");
const jwt = require("jsonwebtoken");

const signToken = (user) => {

    return jwt.sign(
        {
            id : user._id , name : user.name 
        },process.env.JWT_SECRET 
        ,{expiresIn : process.env.JWT_Expires || "15m"}
    );
} ;

const createsendToken = (user , statusCode , message , res ) => {
    const token = signToken(user);
    const sanitizedUser = {
        id : user._id ,
        name : user.email
    }
    res.status(statusCode).json({
        "status" : "success",
        "token" : token ,
        
        "data" : {user :  sanitizedUser ,
            "message" : message ,
        }
    });
};



// const allowedRoles = ["Shelter Owner","requester","admin"];
const roleProfileMap = {
  "ShelterOwner" : "shelterOwnerProfile" ,
   "requester" : "RequesterProfile",
   "admin" : ""
}
const validateData = (email, passwordHash, PhoneNumber, Address) => {
  if (
    !email || 
    !validator.isEmail(email) ||
    !passwordHash ||
    !PhoneNumber || 
    !Address || !Address.addressName || !Address.street
  ) {
    return false;
  }
  return true;
};

const successResponse = (data, statusCode, message, res) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};


const failedResponse = (statusCode, message, res) => {
  res.status(statusCode).json({
    success: false,
    message: message,
    data: null,
  });
};

exports.createPerson = async (req, res) => {
  try {
      const { email, password, PhoneNumber, role, Address, RequesterProfile, shelterOwnerProfile} = req.body;
    
      //step1: basic validation
      if(!email || !password) return res.status(400).json({error:'email and password are required!'})
      if(!validator.isEmail(email)) return res.status(400).json({error: 'invalid email format.'})
      if(!validator.isMobilePhone(PhoneNumber)) return res.status(400).json({error: 'phone number format is invalid!'})

      //step2: check if found in db or not
      const existing = await Person.findOne({email:email})
      if(existing) return res.status(400).json({error: 'email already exists'})
        
      //step3: validate role
      if (!(role in roleProfileMap)) return res.status(400).json({error: 'role is not valid'})

      //step4: hashing pass
      const passwordHash = await bcrypt.hash(password, 12);
      const data = {email, passwordHash, PhoneNumber, role, Address, RequesterProfile, shelterOwnerProfile }

      //step7: save to db
      const newPerson = new Person(personData);
      await newPerson.save();

      //step8: return safe data
      return res.status(201).json({
        message:'account created successfuly!',
        account:{
          email: newPerson.email,
          PhoneNumber: newPerson.PhoneNumber,
          shelterOwnerProfile: newPerson.shelterOwnerProfile
        }
      })

    }catch (error) {
      console.log(error);
      return failedResponse(500, error.message, res);
    }     
};

exports.login = async (req,res) => {
try {
  const {email , password} = req.body ;
  const person = await Person.findOne({email});
  const hashedPass = await bcrypt.hash(password, 12);
  if (!person || ! (await Person.checkPassword(
    hashedPass , person.passwordHash)
  )) {
    return failedResponse(401, "Invalid credentials", res);
  }
  createsendToken(person,200,"you are logged successfully" , res)
  return successResponse(person, 201, "logged in successfully.", res);
} catch (error) {
  console.error(error);
  return failedResponse(500, error.message, res);
}

  
};
exports.updatePerson = async (req,res) => {
  const { id } = req.params;
  const updateData = req.body;
  if(!id){
     return failedResponse(400, "Invalid id", res);
  } 
  if (!validateData(updateData.email,updateData.passwordHash,updateData.PhoneNumber,updateData.Address)) {
    return failedResponse(400, "Invalid data", res);
  }
  try {
    const updatedPerson = await Person.findByIdAndUpdate(id,
      { $set: updateData },
      { new: true, runValidators: true });
      if (!updatedPerson) {
      return failedResponse(404, "Person not found", res);}
       const responseData = {
      id: updatedPerson._id,
      email: updatedPerson.email,
      phone: updatedPerson.phone,
      address: updatedPerson.address,
      updatedAt: updatedPerson.updatedAt
    };

    return successResponse(responseData, 200, "Person details updated successfully", res);
    
  } catch (error) {
    console.error(error);
    
  }
};

exports.protect = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;

        if (authHeader?.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists
        const currentPerson = await Person.findById(decoded.id);
        if (!currentPerson) {
            return res.status(401).json({ message: "User not found" });
        }

        // CHECK if the password was changed after the token was issued
        if (currentPerson.passwordChangedAt) {
            const changedTimestamp = parseInt(currentPerson.passwordChangedAt.getTime() / 1000, 10);
            if (decoded.iat < changedTimestamp) {
                return res.status(401).json({
                    message: "Password was changed recently. Please log in again."
                });
            }
        }

        // Attach user to request
        req.person = currentPerson;
        next();

    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }
        console.error(error);
        res.status(500).json({ message: "Authentication failed" });
    }
};

