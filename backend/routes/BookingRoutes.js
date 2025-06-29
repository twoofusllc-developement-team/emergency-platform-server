const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingControllers');

router.post('/createBooking', BookingController.createBooking);