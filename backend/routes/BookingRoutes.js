const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingControllers');
const authController = require('./../controllers/PersonControllers');
router.post('/createBooking', authController.protect,BookingController.createBooking);
module.exports = router