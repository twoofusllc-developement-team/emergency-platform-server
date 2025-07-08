const moment = require('moment');
const Facility = require('../models/facilityModel');
const Request = require('../models/requestModel');


const validateCommonFields = (req, res) => {
    const { RequestType, RequestName } = req.body;
    const RequesterID = req.person;

    if (!RequesterID) {
        return { error: { status: 404, message: "Requester not found!" } };
    }

    if (!RequestType || !['Request Shelter', 'Request Blood', 'Request Mobility'].includes(RequestType)) {
        return { error: { status: 400, message: "Invalid or missing RequestType." } };
    }

    if (!RequestName || RequestName.trim().length === 0) {
        return { error: { status: 400, message: "RequestName is required." } };
    }

    return { RequesterID, RequestType, RequestName };
};


const handleShelterRequest = async (facilityID, RequesterID, RequestType, RequestName) => {
    try {
        // Check if requester is a shelter owner
        if (RequesterID.role === "ShelterOwner") {
            return { error: { status: 400, message: "Shelter owners cannot request shelters." } };
        }

        // Find and validate shelter
        const shelter = await Facility.findById(facilityID);
        if (!shelter) {
            return { error: { status: 404, message: "Shelter not found!" } };
        }

        if (shelter.facilityType !== "Shelter") {
            return { error: { status: 400, message: "Facility is not a shelter!" } };
        }

        // Check shelter availability
        if (!shelter.ShelterProfile?.isAvailable) {
            return { error: { status: 400, message: "Shelter is currently unavailable!" } };
        }
        if (shelter.status !== "verified") {
            return { error: { status: 400, message: "Shelter is not verified and cannot be requested." } };
        }
        // Validate time availability using moment
        const now = moment();
        const availableFrom = moment(shelter.ShelterProfile.AvailableFrom);
        const availableTo = moment(shelter.ShelterProfile.AvailableTo);

        if (!availableFrom.isValid() || !availableTo.isValid()) {
            return { error: { status: 400, message: "Shelter has invalid availability dates!" } };
        }

        if (now.isBefore(availableFrom)) {
            return { 
                error: { 
                    status: 400, 
                    message: `Shelter is not available until ${availableFrom.format('YYYY-MM-DD HH:mm')}!` 
                } 
            };
        }

        if (now.isAfter(availableTo)) {
            return { 
                error: { 
                    status: 400, 
                    message: `Shelter availability expired on ${availableTo.format('YYYY-MM-DD HH:mm')}!` 
                } 
            };
        }

        // Create shelter request
        const newRequest = new Request({
            RequestType,
            RequestName,
            RequesterID: RequesterID._id,
            RequestShelter: shelter._id
        });

        await newRequest.save();
        return { success: { message: "Shelter request submitted successfully.", requestId: newRequest._id } };

    } catch (error) {
        return { error: { status: 500, message: `Error processing shelter request: ${error.message}` } };
    }
};


const handleBloodRequest = async (RequestBlood, RequesterID, RequestType, RequestName) => {
    try {
        // Validate blood request data
        if (!RequestBlood) {
            return { error: { status: 400, message: "Blood request details are required!" } };
        }

        const { BloodType, quantity, hospital, contact } = RequestBlood;

        // Validate blood type
        const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
        if (!BloodType || !validBloodTypes.includes(BloodType)) {
            return { 
                error: { 
                    status: 400, 
                    message: `Invalid blood type! Valid types: ${validBloodTypes.join(', ')}` 
                } 
            };
        }

        // Validate quantity
        if (!quantity || quantity <= 0) {
            return { error: { status: 400, message: "Quantity must be a positive number!" } };
        }

        // Validate hospital details
        if (!hospital || !hospital.name || !hospital.address) {
            return { error: { status: 400, message: "Hospital name and address are required!" } };
        }

        // Validate contact information
        if (!contact || !contact.phone) {
            return { error: { status: 400, message: "Contact phone number is required!" } };
        }

        // Create blood request
        const newRequest = new Request({
            RequesterID: RequesterID._id,
            RequestType,
            RequestName,
            RequestBlood: {
                BloodType,
                quantity,
                hospital,
                contact,
                urgencyLevel: RequestBlood.urgencyLevel || 'medium'
            }
        });

        await newRequest.save();
        return { success: { message: "Blood request submitted successfully.", requestId: newRequest._id } };

    } catch (error) {
        return { error: { status: 500, message: `Error processing blood request: ${error.message}` } };
    }
};


const handleMobilityRequest = async (RequestMobility, RequesterID, RequestType, RequestName) => {
    try {
        // Validate mobility request data
        if (!RequestMobility) {
            return { error: { status: 400, message: "Mobility request details are required!" } };
        }

        const { pickupLocation, dropoffLocation, pickupTime, contact } = RequestMobility;

        // Validate pickup and dropoff locations
        if (!pickupLocation || !pickupLocation.address) {
            return { error: { status: 400, message: "Pickup location address is required!" } };
        }

        if (!dropoffLocation || !dropoffLocation.address) {
            return { error: { status: 400, message: "Dropoff location address is required!" } };
        }

        // Validate pickup time using moment
        if (!pickupTime) {
            return { error: { status: 400, message: "Pickup time is required!" } };
        }

        const pickupMoment = moment(pickupTime);
        const now = moment();

        if (!pickupMoment.isValid()) {
            return { error: { status: 400, message: "Invalid pickup time format!" } };
        }

        if (pickupMoment.isBefore(now)) {
            return { error: { status: 400, message: "Pickup time cannot be in the past!" } };
        }

        // Check if pickup time is too far in the future (optional business rule)
        const maxAdvanceBooking = moment().add(30, 'days');
        if (pickupMoment.isAfter(maxAdvanceBooking)) {
            return { 
                error: { 
                    status: 400, 
                    message: "Pickup time cannot be more than 30 days in advance!" 
                } 
            };
        }

        // Validate contact information
        if (!contact || !contact.phone) {
            return { error: { status: 400, message: "Contact phone number is required!" } };
        }

        // Create mobility request
        const newRequest = new Request({
            RequesterID: RequesterID._id,
            RequestType,
            RequestName,
            RequestMobility: {
                pickupLocation,
                dropoffLocation,
                pickupTime: pickupMoment.toDate(),
                contact,
                passengers: RequestMobility.passengers || 1,
                specialRequirements: RequestMobility.specialRequirements || ''
            }
        });

        await newRequest.save();
        return { 
            success: { 
                message: "Mobility request submitted successfully.", 
                requestId: newRequest._id,
                scheduledTime: pickupMoment.format('YYYY-MM-DD HH:mm')
            } 
        };

    } catch (error) {
        return { error: { status: 500, message: `Error processing mobility request: ${error.message}` } };
    }
};


exports.createRequest = async (req, res) => {
    try {
        // Validate common fields
        const validation = validateCommonFields(req, res);
        if (validation.error) {
            return res.status(validation.error.status).json({ message: validation.error.message });
        }

        const { RequesterID, RequestType, RequestName } = validation;
        const facilityID = req.params.id;

        let result;

        // Route to appropriate handler based on request type
        switch (RequestType) {
            case "Request Shelter":
                if (!facilityID) {
                    return res.status(400).json({ message: "Facility ID is required for shelter requests!" });
                }
                result = await handleShelterRequest(facilityID, RequesterID, RequestType, RequestName);
                break;

            case "Request Blood":
                result = await handleBloodRequest(req.body.RequestBlood, RequesterID, RequestType, RequestName);
                break;

            case "Request Mobility":
                result = await handleMobilityRequest(req.body.RequestMobility, RequesterID, RequestType, RequestName);
                break;

            default:
                return res.status(400).json({ message: "Invalid RequestType provided!" });
        }

        // Return result
        if (result.error) {
            return res.status(result.error.status).json({ message: result.error.message });
        }

        return res.status(201).json(result.success);

    } catch (error) {
        console.error('Error in createRequest controller:', error);
        return res.status(500).json({ 
            message: "Internal server error occurred while processing request.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


exports.getRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const request = await Request.findById(requestId)
            .populate('RequesterID', 'name email')
            .populate('RequestShelter', 'FacilityName FacilityAddress');

        if (!request) {
            return res.status(404).json({ message: "Request not found!" });
        }

        return res.status(200).json({ request });
    } catch (error) {
        console.error('Error fetching request status:', error);
        return res.status(500).json({ message: "Error fetching request status." });
    }
};


exports.cancelRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const RequesterID = req.person;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found!" });
        }

        // Check if user is the requester
        if (request.RequesterID.toString() !== RequesterID._id.toString()) {
            return res.status(403).json({ message: "You can only cancel your own requests!" });
        }

        // Add cancellation timestamp
        request.status = 'cancelled';
        request.cancelledAt = moment().toDate();
        await request.save();

        return res.status(200).json({ message: "Request cancelled successfully." });
    } catch (error) {
        console.error('Error cancelling request:', error);
        return res.status(500).json({ message: "Error cancelling request." });
    }
};

exports.getUserRequests = async (req, res) => {
    try {
        const RequesterID = req.person._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const requests = await Request.find({ RequesterID })
            .populate('RequestShelter', 'FacilityName FacilityAddress')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Request.countDocuments({ RequesterID });

        return res.status(200).json({
            requests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRequests: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching user requests:', error);
        return res.status(500).json({ message: "Error fetching requests." });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const type = req.query.type;

        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.RequestType = type;

        const requests = await Request.find(filter)
            .populate('RequesterID', 'name email phone')
            .populate('RequestShelter', 'FacilityName FacilityAddress')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Request.countDocuments(filter);

        return res.status(200).json({
            requests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRequests: total
            }
        });
    } catch (error) {
        console.error('Error fetching all requests:', error);
        return res.status(500).json({ message: "Error fetching requests." });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { status, notes } = req.body;
        const validStatuses = ['pending', 'approved', 'rejected', 'fulfilled', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}` 
            });
        }
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found!" });
        }
        // Restrict status transitions
        const allowedTransitions = {
            'pending': ['approved', 'rejected', 'cancelled'],
            'approved': ['fulfilled', 'cancelled'],
            'rejected': [],
            'fulfilled': [],
            'cancelled': []
        };
        if (!allowedTransitions[request.status].includes(status)) {
            return res.status(400).json({
                message: `Cannot change status from '${request.status}' to '${status}'. Allowed: ${allowedTransitions[request.status].join(', ')}`
            });
        }
        request.status = status;
        request.statusUpdatedAt = moment().toDate();
        request.statusUpdatedBy = req.person._id;
        if (notes) request.adminNotes = notes;
        await request.save();
        return res.status(200).json({ 
            message: "Request status updated successfully.",
            request 
        });
    } catch (error) {
        console.error('Error updating request status:', error);
        return res.status(500).json({ message: "Error updating request status." });
    }
};

exports.getFacilityRequests = async (req, res) => {
    try {
        const facilityId = req.params.facilityId;
        const RequesterID = req.person._id;
        // Verify the facility belongs to the user (if they're a shelter owner)
        const facility = await Facility.findById(facilityId);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found!" });
        }
        // Ownership check: assuming facility.ownerId exists
        if (facility.ownerId && facility.ownerId.toString() !== RequesterID.toString()) {
            return res.status(403).json({ message: "Access denied! You do not own this facility." });
        }
        const requests = await Request.find({ 
            RequestShelter: facilityId,
            RequestType: 'Request Shelter'
        })
        .populate('RequesterID', 'name email phone')
        .sort({ createdAt: -1 });
        return res.status(200).json({ requests, facility: facility.FacilityName });
    } catch (error) {
        console.error('Error fetching facility requests:', error);
        return res.status(500).json({ message: "Error fetching facility requests." });
    }
};

exports.searchRequests = async (req, res) => {
    try {
        const { 
            search, 
            type, 
            status, 
            dateFrom, 
            dateTo,
            bloodType,
            location 
        } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build search filter
        const filter = {};

        if (type) filter.RequestType = type;
        if (status) filter.status = status;

        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = moment(dateFrom).startOf('day').toDate();
            if (dateTo) filter.createdAt.$lte = moment(dateTo).endOf('day').toDate();
        }

        if (bloodType) filter['RequestBlood.BloodType'] = bloodType;

        // Text search
        if (search) {
            filter.$or = [
                { RequestName: { $regex: search, $options: 'i' } },
                { 'RequestBlood.hospital.name': { $regex: search, $options: 'i' } },
                { 'RequestMobility.pickupLocation.address': { $regex: search, $options: 'i' } }
            ];
        }

        const requests = await Request.find(filter)
            .populate('RequesterID', 'name email')
            .populate('RequestShelter', 'FacilityName FacilityAddress')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Request.countDocuments(filter);

        return res.status(200).json({
            requests,
            searchCriteria: req.query,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRequests: total
            }
        });
    } catch (error) {
        console.error('Error searching requests:', error);
        return res.status(500).json({ message: "Error searching requests." });
    }
};

exports.approveRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { notes } = req.body;
        const adminUser = req.person;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found!" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: "Only pending requests can be approved!" });
        }

        // If it's a shelter request, mark the facility as unavailable
        if (request.RequestType === 'Request Shelter') {
            // Double-check that no other request was approved in the meantime
            const conflictingRequest = await Request.findOne({
                RequestShelter: request.RequestShelter,
                RequestType: 'Request Shelter',
                status: { $in: ['approved', 'fulfilled'] },
                _id: { $ne: requestId }
            });

            if (conflictingRequest) {
                return res.status(409).json({ 
                    message: "Shelter was already approved for another user!" 
                });
            }

            // Mark facility as unavailable
            await Facility.findByIdAndUpdate(
                request.RequestShelter,
                { 'ShelterProfile.isAvailable': false },
                { new: true }
            );
        }

        // Update request status
        request.status = 'approved';
        request.statusUpdatedAt = moment().toDate();
        request.statusUpdatedBy = adminUser._id;
        if (notes) request.adminNotes = notes;

        await request.save();

        return res.status(200).json({
            message: "Request approved successfully!",
            request,
            facilityReserved: request.RequestType === 'Request Shelter'
        });

    } catch (error) {
        console.error('Error approving request:', error);
        return res.status(500).json({ message: "Error approving request." });
    }
};

exports.rejectRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { notes } = req.body;
        const adminUser = req.person;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found!" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: "Only pending requests can be rejected!" });
        }

        // Update request status
        request.status = 'rejected';
        request.statusUpdatedAt = moment().toDate();
        request.statusUpdatedBy = adminUser._id;
        if (notes) request.adminNotes = notes;

        await request.save();

        return res.status(200).json({
            message: "Request rejected.",
            request
        });

    } catch (error) {
        console.error('Error rejecting request:', error);
        return res.status(500).json({ message: "Error rejecting request." });
    }
};

exports.fulfillRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { notes } = req.body;
        const adminUser = req.person;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found!" });
        }

        if (request.status !== 'approved') {
            return res.status(400).json({ message: "Only approved requests can be fulfilled!" });
        }

        // Update request status
        request.status = 'fulfilled';
        request.statusUpdatedAt = moment().toDate();
        request.statusUpdatedBy = adminUser._id;
        if (notes) request.adminNotes = notes;

        await request.save();

        return res.status(200).json({
            message: "Request marked as fulfilled!",
            request
        });

    } catch (error) {
        console.error('Error fulfilling request:', error);
        return res.status(500).json({ message: "Error fulfilling request." });
    }
};

exports.releaseShelter = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const adminUser = req.person;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found!" });
        }

        if (request.RequestType !== 'Request Shelter') {
            return res.status(400).json({ message: "Only shelter requests can be released!" });
        }

        if (!['approved', 'fulfilled'].includes(request.status)) {
            return res.status(400).json({ message: "Only approved or fulfilled shelter requests can be released!" });
        }

        // Mark facility as available again
        await Facility.findByIdAndUpdate(
            request.RequestShelter,
            { 'ShelterProfile.isAvailable': true },
            { new: true }
        );

        // Update request status to cancelled
        request.status = 'cancelled';
        request.statusUpdatedAt = moment().toDate();
        request.statusUpdatedBy = adminUser._id;
        request.adminNotes = (request.adminNotes || '') + ' | Shelter released and made available again.';

        await request.save();

        return res.status(200).json({
            message: "Shelter released and made available again!",
            request
        });

    } catch (error) {
        console.error('Error releasing shelter:', error);
        return res.status(500).json({ message: "Error releasing shelter." });
    }
};

exports.checkClaimStatus = async (req, res) => {
    try {
        const facilityId = req.params.facilityId;
        const userId = req.person._id;

        const userRequest = await Request.findOne({
            RequesterID: userId,
            RequestShelter: facilityId,
            RequestType: 'Request Shelter'
        }).sort({ createdAt: -1 });

        if (!userRequest) {
            return res.status(200).json({
                canClaim: false,
                status: 'no_request',
                message: "You haven't requested this shelter."
            });
        }

        const claimStatus = {
            pending: {
                canClaim: false,
                message: "Your request is pending approval. Please wait for admin review."
            },
            approved: {
                canClaim: true,
                message: "Congratulations! Your request is approved. You can proceed to the shelter."
            },
            fulfilled: {
                canClaim: true,
                message: "Your shelter booking is active."
            },
            rejected: {
                canClaim: false,
                message: "Your request was rejected. You can submit a new request."
            },
            cancelled: {
                canClaim: false,
                message: "Your request was cancelled. You can submit a new request."
            }
        };

        const result = claimStatus[userRequest.status] || {
            canClaim: false,
            message: "Unknown request status."
        };

        return res.status(200).json({
            canClaim: result.canClaim,
            status: userRequest.status,
            message: result.message,
            requestId: userRequest._id,
            requestDate: userRequest.createdAt,
            lastUpdated: userRequest.statusUpdatedAt
        });

    } catch (error) {
        console.error('Error checking claim status:', error);
        return res.status(500).json({ message: "Error checking claim status." });
    }
};