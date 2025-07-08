const Facility = require('../models/facilityModel')
const Person = require('../models/PersonSchema')

// Middleware validation functions
const validateAuthentication = async (req, res, next) => {
    try {
        if (!req.person) {
            return res.status(401).json({ message: "Authentication required" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Authentication validation failed" });
    }
};

const validateShelterOwnerRole = async (req, res, next) => {
    try {
        if (!req.person || req.person.role !== "ShelterOwner") {
            return res.status(403).json({ message: "Access denied. Shelter owner role required." });
        }
        if (!req.person.shelterOwnerProfile) {
            return res.status(403).json({ message: "You can't perform this action unless you are a verified shelter owner!" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Role validation failed" });
    }
};

const validateAdminRole = async (req, res, next) => {
    try {
        if (!req.person || req.person.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin role required." });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Admin validation failed" });
    }
};

const validateFacilityOwnership = async (req, res, next) => {
    try {
        const facilityId = req.params.id;
        const facility = await Facility.findById(facilityId);
        
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        
        // Allow admin to modify any facility
        if (req.person.role === "admin") {
            req.facility = facility;
            return next();
        }
        
        // Check if the facility belongs to the current user
        if (facility.ownerId && facility.ownerId.toString() !== req.person._id.toString()) {
            return res.status(403).json({ message: "You can only modify facilities that you own!" });
        }
        
        req.facility = facility;
        next();
    } catch (err) {
        return res.status(500).json({ message: "Ownership validation failed" });
    }
};

const validateFacilityStatus = async (req, res, next) => {
    try {
        const facility = req.facility;
        if (facility.status === "pending") {
            return res.status(400).json({ message: "Cannot modify facility while it's pending verification!" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Status validation failed" });
    }
};

const validateFacilityCapacity = async (req, res, next) => {
    try {
        const { capacity } = req.body;
        
        if (capacity !== undefined) {
            if (capacity < 1 || capacity > 1000) {
                return res.status(400).json({ 
                    message: "Capacity must be between 1 and 1000!" 
                });
            }
        }
        
        next();
    } catch (err) {
        return res.status(500).json({ message: "Capacity validation failed" });
    }
};

function validateFacility(data) {
    const errors = [];
  
    // FacilityName: required string
    if (typeof data.FacilityName !== 'string' || !data.FacilityName.trim()) {
      errors.push('FacilityName is required and must be a non-empty string.');
    }
  
    // facilityType: required array of allowed strings
    const allowedTypes = ["Hospital", "NGO", "Shelter"];

    if (!allowedTypes.includes(data.facilityType)) {
      errors.push('facilityType is required and must be in the valid types');
    } 

    // FacilityDescription: optional string
    if (data.FacilityDescription && typeof data.FacilityDescription !== 'string') {
      errors.push('FacilityDescription must be a string.');
    }
  
    // FacilityImages: array of strings (optional)
    if (data.FacilityImages) {
      if (!Array.isArray(data.FacilityImages)) {
        errors.push('FacilityImages must be an array.');
      } else {
        data.FacilityImages.forEach(img => {
          if (typeof img !== 'string') {
            errors.push('Each FacilityImage must be a string.');
          }
        });
      }
    }
  
    // FacilityAddress: required object with location & address
    if (typeof data.FacilityAddress !== 'object' || !data.FacilityAddress) {
      errors.push('FacilityAddress is required.');
    } else {
      const addr = data.FacilityAddress;
      if (typeof addr.address !== 'string' || !addr.address.trim()) {
        errors.push('FacilityAddress.address is required and must be a string.');
      }
  
      if (!addr.location || typeof addr.location !== 'object') {
        errors.push('FacilityAddress.location is required.');
      } else {
        if (addr.location.type !== 'Point') {
          errors.push('FacilityAddress.location.type must be "Point".');
        }
        if (
          !Array.isArray(addr.location.coordinates) ||
          addr.location.coordinates.length !== 2 ||
          !addr.location.coordinates.every(coord => typeof coord === 'number')
        ) {
          errors.push('FacilityAddress.location.coordinates must be an array of two numbers [lng, lat].');
        }
      }
    }
  
    // ShelterProfile: optional nested object
    if (data.ShelterProfile) {
      const shelter = data.ShelterProfile;
  
      if (shelter.ShelterProperties) {
        if (!Array.isArray(shelter.ShelterProperties)) {
          errors.push('ShelterProfile.ShelterProperties must be an array.');
        } else {
          shelter.ShelterProperties.forEach(prop => {
            if (typeof prop !== 'string') {
              errors.push('Each ShelterProperty must be a string.');
            }
          });
        }
      }
  
      ['isFurnished', 'isShared', 'isAvailable'].forEach(field => {
        if (field in shelter && typeof shelter[field] !== 'boolean') {
          errors.push(`ShelterProfile.${field} must be a boolean.`);
        }
      });
  
      if ('capacity' in shelter && (typeof shelter.capacity !== 'number' || shelter.capacity < 0)) {
        errors.push('ShelterProfile.capacity must be a non-negative number.');
      }
  
      ['AvailableFrom', 'AvailableTo'].forEach(field => {
        if (shelter[field] && isNaN(Date.parse(shelter[field]))) {
          errors.push(`ShelterProfile.${field} must be a valid date.`);
        }
      });
    }
  
    // status: optional enum
    if (data.status && !['pending', 'verified'].includes(data.status)) {
      errors.push('status must be either "pending" or "verified".');
    }
  
    return errors;
  }

  
exports.createShelter = async (req, res) => {
    try{
        const user = req.person;
        if (!user){
            return res.status(404).json({message:"User not found! Please try again!"})
        }
        if (!user.shelterOwnerProfile){
            return res.status(400).json({message:"You can't create a shelter unless you are an owner!"})
        }

        const {
            FacilityName,
            facilityType,
            FacilityDescription,
            FacilityImages,
            FacilityAddress,
            ShelterProperties,
            isFurnished,
            capacity,
            isShared,
            isAvailable,
            AvailableFrom,
            AvailableTo
        } = req.body;

        // Set default available times if not provided
        const now = new Date();
        const defaultAvailableFrom = now;
        const defaultAvailableTo = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

        const shelterProfile = {
            ShelterProperties,
            isFurnished,
            capacity,
            isShared,
            isAvailable,
            AvailableFrom: AvailableFrom ? new Date(AvailableFrom) : defaultAvailableFrom,
            AvailableTo: AvailableTo ? new Date(AvailableTo) : defaultAvailableTo
        };

        // Prepare data for validation
        const facilityData = {
            FacilityName,
            facilityType,
            FacilityDescription,
            FacilityImages,
            FacilityAddress,
            ShelterProfile: shelterProfile
        };

        // Validate the facility data
        const validationErrors = validateFacility(facilityData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationErrors
            });
        }

        const newShelter = new Facility({
            FacilityName,
            facilityType,
            FacilityDescription,
            FacilityImages,
            FacilityAddress,
            ShelterProfile: shelterProfile,
            status: "pending",
            ownerId: user._id // Add owner reference
        });

        await newShelter.save()
        
        return res.status(200).json({message:"Pending Verification!", shelter: newShelter})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

// Get all facilities
exports.getAllFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find({});
        return res.status(200).json({
            message: "Facilities retrieved successfully",
            count: facilities.length,
            facilities: facilities
        });
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving facilities: " + err.message });
    }
}

// Get facility by ID
exports.getFacilityById = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        return res.status(200).json({
            message: "Facility retrieved successfully",
            facility: facility
        });
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving facility: " + err.message });
    }
}

// Update facility
exports.updateFacility = async (req, res) => {
    try {
        const facilityId = req.params.id;
        const facility = await Facility.findById(facilityId);
        
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }

        // Prepare data for validation
        const facilityData = {
            FacilityName: req.body.FacilityName || facility.FacilityName,
            facilityType: req.body.facilityType || facility.facilityType,
            FacilityDescription: req.body.FacilityDescription || facility.FacilityDescription,
            FacilityImages: req.body.FacilityImages || facility.FacilityImages,
            FacilityAddress: req.body.FacilityAddress || facility.FacilityAddress,
            ShelterProfile: {
                ShelterProperties: req.body.ShelterProperties || facility.ShelterProperties,
                isFurnished: req.body.isFurnished !== undefined ? req.body.isFurnished : facility.isFurnished,
                capacity: req.body.capacity || facility.capacity,
                isShared: req.body.isShared !== undefined ? req.body.isShared : facility.isShared,
                isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : facility.isAvailable,
                AvailableFrom: req.body.AvailableFrom || facility.AvailableFrom,
                AvailableTo: req.body.AvailableTo || facility.AvailableTo
            },
            status: req.body.status || facility.status
        };

        // Validate the facility data
        const validationErrors = validateFacility(facilityData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationErrors
            });
        }

        const updatedFacility = await Facility.findByIdAndUpdate(
            facilityId,
            req.body,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Facility updated successfully",
            facility: updatedFacility
        });

    } catch (err) {
        return res.status(500).json({ message: "Error updating facility: " + err.message });
    }
}

// Delete facility
exports.deleteFacility = async (req, res) => {
    try {
        const facilityId = req.params.id;
        const facility = await Facility.findById(facilityId);
        
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }

        await Facility.findByIdAndDelete(facilityId);

        return res.status(200).json({
            message: "Facility deleted successfully",
            deletedFacility: facility
        });

    } catch (err) {
        return res.status(500).json({ message: "Error deleting facility: " + err.message });
    }
}

// Get facilities by type
exports.getFacilitiesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const facilities = await Facility.find({ facilityType: { $in: [type] } });
        
        return res.status(200).json({
            message: `Facilities of type ${type} retrieved successfully`,
            count: facilities.length,
            facilities: facilities
        });
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving facilities by type: " + err.message });
    }
}

// Get verified facilities only
exports.getVerifiedFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find({ status: "verified" });
        
        return res.status(200).json({
            message: "Verified facilities retrieved successfully",
            count: facilities.length,
            facilities: facilities
        });
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving verified facilities: " + err.message });
    }
}

// Export middleware functions for use in routes
exports.validateAuthentication = validateAuthentication;
exports.validateShelterOwnerRole = validateShelterOwnerRole;
exports.validateAdminRole = validateAdminRole;
exports.validateFacilityOwnership = validateFacilityOwnership;
exports.validateFacilityStatus = validateFacilityStatus;
exports.validateFacilityCapacity = validateFacilityCapacity;
