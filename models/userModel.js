const pool = require('../config/db');

exports.createUser = async (userData) => {
    const { firstName, lastName, dob, gender, phoneNumber, email, referenceId, password } = userData;
    const result = await pool.query(
        `INSERT INTO users (first_name, last_name, dob, gender, phone_number, email, reference_id, password)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [firstName, lastName, dob, gender, phoneNumber, email, referenceId, password]
    );
    return result.rows[0];
};

exports.findUserByEmail = async (email) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
};
