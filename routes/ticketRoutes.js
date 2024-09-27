const express = require('express');
const ticketController = require('../controllers/ticketController');
const upload = require('../middlewares/upload');

const router = express.Router();


router.post('/tickets', upload.single('file'), ticketController.createTicket);
router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/:id', ticketController.getTicketById);
router.put('/tickets/:id', upload.single('file'), ticketController.updateTicket);
router.delete('/tickets/:id', ticketController.deleteTicket);

module.exports = router;
