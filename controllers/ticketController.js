

const ticketService = require('../services/ticketService');


exports.createTicket = async (req, res) => {
    try {
        const result = await ticketService.createTicket(req.body, req.file);
        res.status(201).json({ message: 'Ticket raised successfully', ticketId: result.id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        res.status(200).json(ticket);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};


exports.updateTicket = async (req, res) => {
    try {
        const ticket = await ticketService.updateTicket(req.params.id, req.body, req.file);
        res.status(200).json({ message: 'Ticket updated successfully', ticket });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.deleteTicket = async (req, res) => {
    try {
        await ticketService.deleteTicket(req.params.id);
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

