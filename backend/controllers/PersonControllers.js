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
  "Shelter Owner" : "shelterOwnerProfile" ,
   "requester" : "RequesterProfile",
   "admin" : ""
}
const validateData = (email, passwordHash, PhoneNumber, Address) => {
  // const { email, passwordHash, PhoneNumber, role, Address, RequesterProfile } = data;

  if (
    !email || 
    // !/^\S+@\S+\.\S+$/.test(email) 
    validator.isEmail(email)||
    !passwordHash ||
    !PhoneNumber || 
    // !/^\d{10}$/.test(PhoneNumber) 
    validator.isMobilePhone(PhoneNumber)||
    // role !== "requester" ||
    !Address || !Address[0]?.street || !Address[0]?.AddressName // ||
    // !RequesterProfile || !RequesterProfile.Requester || !RequesterProfile.Documents
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
    console.log(req.body);
    const { email, passwordHash, PhoneNumber, role, Address, RequesterProfile ,shelterOwnerProfile } = req.body;
    const existingPerson = await Person.findOne({ email });
    if (existingPerson) {
      return failedResponse(409, "Person with this email already exists.", res);
    }
    if (!role) {
       return failedResponse(409, "role not exist", res);
    }
    profileKey = roleProfileMap[role];
    if (profileKey) { // if i don t have  => role = admin => i don t need test profile existing
      profileData = req.body[profileKey] ;
      if(!profileData){
        return failedResponse(409, "missing profile data", res);
      }
      if (!validateData(req.body)) {
      return failedResponse(400, "Invalid or missing data.", res);
      }
       const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordHash, saltRounds);
       const PersonData = {
          email,
          passwordHash: hashedPassword,
          PhoneNumber,
         role,
         Address,
         profileData,
          };
          const newperson = await Person.create(PersonData);
        // const newperson = new Person(PersonData);
        //  await newperson.save();
         return successResponse(PersonData, 201, "Person registered successfully.", res);
         }
    if (!validateData(req.body)) {
  return failedResponse(400, "Invalid or missing data.", res);
}
   const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordHash, saltRounds);
  const PersonData = {
    email,
    passwordHash: hashedPassword,
    PhoneNumber,
    role,
    Address,
  
  };
  const newperson = new Person(PersonData);
    await newperson.save();
  return successResponse(PersonData, 201, "Person registered successfully.", res);

    
  } catch (error) {
    console.log(error);
     return failedResponse(500, error.message, res);
  }
     
};
exports.login = async (req,res) => {
try {
  const {email , passwordHash} = req.body ;
  const person = await Person.findOne({email});
  if (!person || ! (await Person.checkPassword(
    passwordHash , person.passwordHash)
  )) {
    return failedResponse(401, "Invalid credentials", res);
  }
  createsendToken(person,200,"you are logged successfully" , res)
  // return successResponse(person, 201, "logged in successfully.", res);
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
  // if (updateData.email && !/^\S+@\S+\.\S+$/.test(updateData.email)) {
  //   return failedResponse(400, "Invalid email format", res);
  // }
  if (!updateData.firstName) {
    return failedResponse(400, "Invalid first name", res);
  }
  if(!updateData.lastName){
    return failedResponse(400, "Invalid last name", res);
  }
  if (!validateData(updateData.email,updateData.hashedPassword,updateData.PhoneNumber,updateData.Address)) {
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
      firstName: updatedPerson.firstName,
      lastName: updatedPerson.lastName,
      email: updatedPerson.email,
      phone: updatedPerson.phone,
      address: updatedPerson.address,
      isActive: updatedPerson.isActive,
      updatedAt: updatedPerson.updatedAt
    };

    return successResponse(responseData, 200, "Person details updated successfully", res);
    
  } catch (error) {
    console.error(error);
    
  }
};

exports.protect = async (req , res , next) => {
    try {
        let token ;
        const authHeader = req.headers.authorization ;
        if (authHeader?.startWith("Bearer ")) {
            authHeader.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({"message" : "not authonticated"});
        }
        // to verifie the token 
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // chek if user exist 
        const currentPerson = await Person.findById(decoded.id);
        if(!currentPerson){
             res.status(401).json({"message" : "user not found"});
        }
        // verify password not changed after token is send

        // if token is valide
        req.person = currentPerson;
        next();

    } catch (error) {
        if (error.name = "jsonWebTokenError") {
            res.status(401).json({"message" : "invalaid token"});
        }
        if (error.name = "tokenExpiredError") {
            res.status(401).json({"message" : "token expired , you should login again"});
        }
        console.error(error);
        res.status(500).json({"message" : "faile"});
    }
};

