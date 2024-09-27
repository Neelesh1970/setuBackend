

const pool = require('../config/db');  
const path = require('path');


exports.createTicket = async (ticketData, file) => {
    const { issueType, description } = ticketData;

    
    const validIssueTypes = ['Appointment', 'Generic Medicine', 'Organ donation', 'Insurance', 'Government Schemes', 'Matrimony', 'Mobile APP Issue', 'Others'];
    if (!validIssueTypes.includes(issueType)) {
        throw new Error('Invalid issue type');
    }

    
    let filePath = null;
    if (file) {
        filePath = path.join('uploads', file.filename);
    }

    
    const result = await pool.query(
        `INSERT INTO tickets (issue_type, description, file_path)
         VALUES ($1, $2, $3) RETURNING id, issue_type, description, file_path, created_at`,
        [issueType, description, filePath]
    );

    return result.rows[0];
};



exports.getTicketById = async (ticketId) => {
    const result = await pool.query(
        `SELECT id, issue_type, description, file_path, created_at FROM tickets WHERE id = $1`,
        [ticketId]
    );
    
    if (result.rows.length === 0) {
        throw new Error('Ticket not found');
    }

    return result.rows[0];
};


exports.updateTicket = async (ticketId, ticketData, file) => {
    const { issueType, description } = ticketData;

    const validIssueTypes = ['Appointment', 'Generic Medicine', 'Organ donation', 'Insurance', 'Government Schemes', 'Matrimony', 'Mobile APP Issue', 'Others'];
    if (!validIssueTypes.includes(issueType)) {
        throw new Error('Invalid issue type');
    }

    let filePath = null;
    if (file) {
        filePath = path.join('uploads', file.filename);
    }

    const result = await pool.query(
        `UPDATE tickets SET issue_type = $1, description = $2, file_path = COALESCE($3, file_path)
         WHERE id = $4 RETURNING id, issue_type, description, file_path, updated_at`,
        [issueType, description, filePath, ticketId]
    );

    if (result.rows.length === 0) {
        throw new Error('Ticket not found');
    }

    return result.rows[0];
};


exports.deleteTicket = async (ticketId) => {
    const result = await pool.query(
        `DELETE FROM tickets WHERE id = $1 RETURNING id`,
        [ticketId]
    );

    if (result.rows.length === 0) {
        throw new Error('Ticket not found');
    }

    return { message: 'Ticket deleted successfully' };
};


exports.getAllTickets = async () => {
    const result = await pool.query(
        `SELECT id, issue_type, description, file_path, created_at FROM tickets`
    );

    return result.rows;
};

