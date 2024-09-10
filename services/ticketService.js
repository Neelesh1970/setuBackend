

const pool = require('../config/db');  // Database connection
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
