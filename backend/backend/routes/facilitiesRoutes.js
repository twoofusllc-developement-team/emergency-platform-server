const express = require('express');
const router = express.Router();
const facilitiesController = require('../controllers/facilitiesController');

router.post('/createShelter', facilitiesController.createShelter);