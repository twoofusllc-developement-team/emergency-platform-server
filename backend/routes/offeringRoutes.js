const express = require('express');
const router = express.Router();
const OfferingController = require('../controllers/OfferingControllers');
const authController = require('./../controllers/PersonControllers');
router.post('/createOffering',authController.protect ,OfferingController.createOffer);