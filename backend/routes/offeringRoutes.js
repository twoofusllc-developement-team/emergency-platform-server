const express = require('express');
const router = express.Router();
const OfferingController = require('../controllers/OfferingControllers');
router.post('/createOffering', OfferingController.createOffer);