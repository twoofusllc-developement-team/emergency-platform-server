const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestsController')

router.post('/createRequest', requestController.createRequest)
module.exports = router