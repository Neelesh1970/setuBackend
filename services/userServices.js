const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const pool = require('../config/db');

exports.registerUser = async (userData) => {
    const { firstName, lastName, dob, gender, phoneNumber, email, referenceId, password, confirmPassword } = userData;

    // Collect missing fields
    let missingFields = [];
    
    if (!firstName) missingFields.push('First Name');
    if (!lastName) missingFields.push('Last Name');
    if (!dob) missingFields.push('Date of Birth');
    if (!gender) missingFields.push('Gender');
    if (!phoneNumber) missingFields.push('Phone Number');
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
    if (!confirmPassword) missingFields.push('Confirm Password');

    if (missingFields.length > 0) {
        throw new Error(`This field is required: ${missingFields.join(', ')}`);
    }

    // Validate password match
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await pool.query(
        `INSERT INTO users (first_name, last_name, dob, gender, phone_number, email, reference_id, password)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, first_name, last_name, dob, gender, phone_number, email, reference_id, created_at`,
        [firstName, lastName, dob, gender, phoneNumber, email, referenceId, hashedPassword]
    );

    return result.rows[0];
};

exports.loginUser = async (loginData) => {
    const { email, password } = loginData;

    if (!email || !password) {
        throw new Error('Please provide both email and password');
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
        throw new Error('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
        throw new Error('Invalid email or password');
    }

   
    return { message: 'Login successful' };
};

exports.getAllUsers = async () => {
    const users = await pool.query('SELECT id, first_name, last_name, dob, phone_number, email, reference_id, created_at, updated_at FROM users');
    return users.rows;
};


exports.getUserById = async (id) => {
    if (!id) {
        throw new Error('Please provide a user ID');
    }

    const user = await pool.query('SELECT id, first_name, last_name, dob, phone_number, email, reference_id, created_at, updated_at FROM users WHERE id = $1', [id]);

    if (user.rows.length === 0) {
        throw new Error('User not found');
    }

    return user.rows[0];
};
