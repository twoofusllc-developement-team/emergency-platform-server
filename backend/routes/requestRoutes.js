const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestsController')
const PersonController = require('../controllers/PersonControllers')

router.post('/createRequest',PersonController.protect, requestController.createRequest)
module.exports = router