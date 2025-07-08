const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestsController');
const PersonController = require('../controllers/PersonControllers');

// Create new request routes
router.post('/createRequest/:id', PersonController.protect, requestController.createRequest);
router.post('/createRequest', PersonController.protect, requestController.createRequest); // For blood and mobility requests (no facility ID needed)
// Get request status and details
router.get('/request/:requestId', PersonController.protect, requestController.getRequestStatus);
// Cancel a request
router.put('/request/:requestId/cancel', PersonController.protect, requestController.cancelRequest);
// Get all requests for the authenticated user
router.get('/my-requests', PersonController.protect, requestController.getUserRequests);
// Check if user can claim a specific facility
router.get('/facility/:facilityId/claim-status', PersonController.protect, requestController.checkClaimStatus);
// Admin/Staff actions for request management
router.put('/request/:requestId/approve', PersonController.protect, PersonController.isOwner, requestController.approveRequest);
router.put('/request/:requestId/reject', PersonController.protect, PersonController.isOwner, requestController.rejectRequest);
router.put('/request/:requestId/fulfill', PersonController.protect, PersonController.isOwner, requestController.fulfillRequest);
router.put('/request/:requestId/release-shelter', PersonController.protect, PersonController.isOwner, requestController.releaseShelter);
// Get all requests (admin/staff only)
router.get('/all-requests', PersonController.protect, PersonController.isAdmin, requestController.getAllRequests);
router.put('/request/:requestId/status', PersonController.protect, PersonController.isAdmin, requestController.updateRequestStatus);
// Get requests by facility (for shelter owners)
router.get('/facility/:facilityId/requests', PersonController.protect, requestController.getFacilityRequests);
// Get requests by searching
router.get('/requests/search', PersonController.protect, requestController.searchRequests);

module.exports = router;