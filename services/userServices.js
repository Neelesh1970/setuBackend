const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const pool = require('../config/db');

const fs = require('fs');
const path = require('path');
const multer = require('multer');

exports.registerUser = async (userData) => {
    const {
        firstName, lastName, dob, gender, phoneNumber, email, referenceId,
        password, confirmPassword, username, isActive, isDeleted
    } = userData;

    let missingFields = [];

   
    if (!firstName) missingFields.push('First Name');
    if (!lastName) missingFields.push('Last Name');
    if (!dob) missingFields.push('Date of Birth');
    if (!gender) missingFields.push('Gender');
    if (!phoneNumber) missingFields.push('Phone Number');
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
    if (!confirmPassword) missingFields.push('Confirm Password');
    if (!username) missingFields.push('Username');

    if (missingFields.length > 0) {
        throw new Error(`These fields are required: ${missingFields.join(', ')}`);
    }

    
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const result = await pool.query(
        `INSERT INTO users (first_name, last_name, dob, gender, phone_number, email, reference_id, password, username, isActive, isDeleted)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
         RETURNING id, first_name, last_name, dob, gender, phone_number, email, reference_id, username, isActive, isDeleted, created_at`,
        [
            firstName, lastName, dob, gender, phoneNumber, email, referenceId, 
            hashedPassword, username, isActive || true, isDeleted || false
        ]
    );

    return result.rows[0];
};


exports.loginUser = async (loginData) => {
    const { email, phoneNumber, password } = loginData;

    if ((!email && !phoneNumber) || !password) {
        throw new Error('Please provide either an email or phone number and password');
    }

    let userQuery = '';
    let userParams = [];

    
    if (email) {
        userQuery = 'SELECT * FROM users WHERE email = $1';
        userParams = [email];
    } else if (phoneNumber) {
        userQuery = 'SELECT * FROM users WHERE phone_number = $1';
        userParams = [phoneNumber];
    }

    const user = await pool.query(userQuery, userParams);

    if (user.rows.length === 0) {
        throw new Error('Invalid email/phone number or password');
    }

    const userRecord = user.rows[0];

    
    if (userRecord.isdeleted) {
        
        await pool.query('UPDATE users SET isDeleted = false WHERE id = $1', [userRecord.id]);
    }

   
    const validPassword = await bcrypt.compare(password, userRecord.password);

    if (!validPassword) {
        throw new Error('Invalid email/phone number or password');
    }

   
    return {
        message: 'Login successful',
        
        token: jwt.sign({ id: userRecord.id, username: userRecord.username }, 'your_jwt_secret', { expiresIn: '1h' })
    };
};


exports.signOutUser = async (userId) => {
    await pool.query('UPDATE users SET isDeleted = true WHERE id = $1', [userId]);
    return { message: 'User signed out successfully' };
};


exports.getAllUsers = async () => {
    const users = await pool.query('SELECT id, first_name, last_name, dob, gender, phone_number, email, reference_id, profile_photo, isActive, created_at, updated_at FROM users');
    return users.rows;
};


exports.getUserById = async (id) => {
    if (!id) {
        throw new Error('Please provide a user ID');
    }

    const user = await pool.query('SELECT id, first_name, last_name, dob, gender, phone_number, email, reference_id, isActive, created_at, updated_at FROM users WHERE id = $1', [id]);

    if (user.rows.length === 0) {
        throw new Error('User not found');
    }

    return user.rows[0];
};

exports.deleteUser = async (id) => {

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    return { message: `User with ID ${id} has been deleted` };
};



exports.updateUser = async (id, userData, file) => {
    const {
        firstName, lastName, username, dob, gender, phoneNumber, email, referenceId, password, confirmPassword,
        bloodGroup, height, weight, emergencyContact
    } = userData;

    
    let fields = [];
    let values = [];
    let index = 1;

    
    if (firstName) { fields.push(`first_name = $${index++}`); values.push(firstName); }
    if (lastName) { fields.push(`last_name = $${index++}`); values.push(lastName); }
    if (username) { fields.push(`username = $${index++}`); values.push(username); } 
    if (dob) { fields.push(`dob = $${index++}`); values.push(dob); }
    if (gender) { fields.push(`gender = $${index++}`); values.push(gender); }
    if (phoneNumber) { fields.push(`phone_number = $${index++}`); values.push(phoneNumber); }
    if (email) { fields.push(`email = $${index++}`); values.push(email); }
    if (referenceId) { fields.push(`reference_id = $${index++}`); values.push(referenceId); }
    if (bloodGroup) { fields.push(`blood_group = $${index++}`); values.push(bloodGroup); }
    if (height) { fields.push(`height = $${index++}`); values.push(height); }
    if (weight) { fields.push(`weight = $${index++}`); values.push(weight); }
    if (emergencyContact) { fields.push(`emergency_contact = $${index++}`); values.push(emergencyContact); }

    
    if (password) {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push(`password = $${index++}`);
        values.push(hashedPassword);
    }

    
    if (file) {
        const filePath = path.join('uploads', file.filename);
        fields.push(`profile_photo = $${index++}`);
        values.push(filePath);
    }

    
    if (fields.length === 0) {
        throw new Error('No fields provided for update');
    }

    
    values.push(id);

    
    const query = `
        UPDATE users
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${index}
        RETURNING id, first_name, last_name, username, dob, gender, phone_number, email, reference_id, blood_group, height, weight, emergency_contact, created_at, updated_at, profile_photo;
    `;

    try {
        
        const result = await pool.query(query, values);

        
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};


