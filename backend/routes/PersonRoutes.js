const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/PersonControllers');

router.post('/signup', PersonController.signup);
router.put('/updatePerson/:id',PersonController.protect, PersonController.updatePerson);
router.post('/login', PersonController.login)

module.exports = router