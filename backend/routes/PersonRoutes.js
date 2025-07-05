const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/PersonControllers');

router.post('/createPerson',PersonController.protect, PersonController.createPerson);
router.put('/updatePerson/:id',PersonController.protect, PersonController.updatePerson);
router.post('/login',PersonController.protect, PersonController.login)

module.exports = router