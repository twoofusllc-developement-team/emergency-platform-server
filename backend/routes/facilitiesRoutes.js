const express = require('express');
const router = express.Router();
const facilitiesController = require('../controllers/facilitiesController')
const authController = require('../controllers/PersonControllers')

// Create operations
router.post('/facilities', 
    authController.protect, 
    facilitiesController.validateShelterOwnerRole,
    facilitiesController.validateFacilityCapacity,
    facilitiesController.createShelter
)

// Read operations (public access)
router.get('/facilities', facilitiesController.getAllFacilities)
router.get('/facilities/:id', facilitiesController.getFacilityById)
router.get('/facilities/type/:type', facilitiesController.getFacilitiesByType)
router.get('/facilities/verified', facilitiesController.getVerifiedFacilities)

// Update operations (require authentication and ownership)
router.put('/facilities/:id', 
    authController.protect, 
    facilitiesController.validateFacilityOwnership,
    facilitiesController.validateFacilityStatus,
    facilitiesController.validateFacilityCapacity,
    facilitiesController.updateFacility
)
router.put('/facilities/:id', 
    authController.protect, 
    facilitiesController.validateFacilityOwnership,
    facilitiesController.validateFacilityStatus,
    facilitiesController.validateFacilityCapacity,
    facilitiesController.updateFacility
)

// Delete operations (require authentication and ownership)
router.delete('/facilities/:id', 
    authController.protect, 
    facilitiesController.validateFacilityOwnership,
    facilitiesController.deleteFacility
)

module.exports = router