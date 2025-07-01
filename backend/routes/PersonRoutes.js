const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/PersonControllers');
const authController = require('./../controllers/PersonControllers');
router.post('/createPerson', PersonController.createPerson);
router.put('/updatePerson/:id',authController.protect,PersonController.updatePerson);