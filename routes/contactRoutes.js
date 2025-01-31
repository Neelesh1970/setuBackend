const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');


router.post('/insert-contacts/:id', contactController.insertContacts);


router.post('/delete-contact1/:id', (req, res) => contactController.deleteContact(req, res, 1));


router.post('/delete-contact2/:id', (req, res) => contactController.deleteContact(req, res, 2));


router.post('/delete-contact3/:id', (req, res) => contactController.deleteContact(req, res, 3));


router.post('/delete-contact4/:id', (req, res) => contactController.deleteContact(req, res, 4));


router.get('/emergency-contacts/:id', contactController.getEmergencyContacts);



module.exports = router;
