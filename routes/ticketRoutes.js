

const express = require('express');
const ticketController = require('../controllers/ticketController');
const upload = require('../middlewares/upload'); 

const router = express.Router();


router.post('/tickets', upload.single('file'), ticketController.createTicket);

module.exports = router;
