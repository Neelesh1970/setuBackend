const pool = require('../config/db');

exports.searchJobs = async (searchCriteria) => {
    const { jobTitle, companyName, location } = searchCriteria;

    let query = 'SELECT * FROM job_postings WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    
    if (jobTitle) {
        query += ` AND job_title ILIKE $${paramIndex}`;
        values.push(`%${jobTitle}%`);
        paramIndex++;
    }
    if (companyName) {
        query += ` AND company_name ILIKE $${paramIndex}`;
        values.push(`%${companyName}%`);
        paramIndex++;
    }
    if (location) {
        query += ` AND location ILIKE $${paramIndex}`;
        values.push(`%${location}%`);
        paramIndex++;
    }

  
    const result = await pool.query(query, values);
    return result.rows;
};

exports.getAllJobs = async () => {
    const query = 'SELECT * FROM job_postings';
    const result = await pool.query(query);
    return result.rows;
};
