const express = require('express');
const router = express.Router();
const facilitiesController = require('../controllers/facilitiesController')

router.post('/createShelter/:id', facilitiesController.createShelter)
router.get('/getShelters', facilitiesController.getShelters)
module.exports = router