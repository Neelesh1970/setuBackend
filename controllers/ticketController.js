

const ticketService = require('../services/ticketService');


exports.createTicket = async (req, res) => {
    try {
        const result = await ticketService.createTicket(req.body, req.file);
        res.status(201).json({ message: 'Ticket raised successfully', ticketId: result.id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
