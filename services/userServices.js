const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const pool = require('../config/db');

exports.registerUser = async (userData) => {
    const { firstName, lastName, dob, gender, phoneNumber, email, referenceId, password, confirmPassword } = userData;

    
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

    
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
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
    const users = await pool.query('SELECT id, first_name, last_name, dob, gender, phone_number, email, reference_id, created_at, updated_at FROM users');
    return users.rows;
};


exports.getUserById = async (id) => {
    if (!id) {
        throw new Error('Please provide a user ID');
    }

    const user = await pool.query('SELECT id, first_name, last_name, dob, gender, phone_number, email, reference_id, created_at, updated_at FROM users WHERE id = $1', [id]);

    if (user.rows.length === 0) {
        throw new Error('User not found');
    }

    return user.rows[0];
};



exports.updateUser = async (id, userData) => {
    const { firstName, lastName, dob, gender, phoneNumber, email, referenceId, password, confirmPassword } = userData;

   
    let fields = [];
    let values = [];
    let index = 1;

    if (firstName) { fields.push(`first_name = $${index++}`); values.push(firstName); }
    if (lastName) { fields.push(`last_name = $${index++}`); values.push(lastName); }
    if (dob) { fields.push(`dob = $${index++}`); values.push(dob); }
    if (gender) { fields.push(`gender = $${index++}`); values.push(gender); }
    if (phoneNumber) { fields.push(`phone_number = $${index++}`); values.push(phoneNumber); }
    if (email) { fields.push(`email = $${index++}`); values.push(email); }
    if (referenceId) { fields.push(`reference_id = $${index++}`); values.push(referenceId); }
    
    if (password) {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push(`password = $${index++}`);
        values.push(hashedPassword);
    }

    if (fields.length === 0) {
        throw new Error('No fields provided for update');
    }

   
    values.push(id);

    
    const query = `
        UPDATE users
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${index}
        RETURNING id, first_name, last_name, dob, gender, phone_number, email, reference_id, created_at, updated_at;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    return result.rows[0];
};


exports.addFamilyMember = async (userId, familyData) => {
    const { firstName, lastName, relation, dob, gender, bloodGroup, height, weight } = familyData;

    
    if (!firstName) throw new Error('First Name is required');
    if (!lastName) throw new Error('Last Name is required');
    if (!relation) throw new Error('Relation is required');
    if (!dob) throw new Error('Date of Birth is required');
    if (!gender) throw new Error('Gender is required');

    
    const result = await pool.query(
        `INSERT INTO family_members (user_id, first_name, last_name, relation, dob, gender, blood_group, height, weight)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, first_name, last_name, relation, dob, gender, blood_group, height, weight, created_at`,
        [userId, firstName, lastName, relation, dob, gender, bloodGroup, height, weight]
    );

    return result.rows[0];
};



exports.updateFamilyMember = async (familyId, familyData) => {
    const { firstName, lastName, relation, dob, gender, bloodGroup, height, weight } = familyData;


    if (!firstName && !lastName && !relation && !dob && !gender && !bloodGroup && !height && !weight) {
        throw new Error('No fields provided for update');
    }

    
    const fields = [];
    const values = [];
    let query = 'UPDATE family_members SET ';

    if (firstName) {
        fields.push('first_name = $' + (fields.length + 1));
        values.push(firstName);
    }
    if (lastName) {
        fields.push('last_name = $' + (fields.length + 1));
        values.push(lastName);
    }
    if (relation) {
        fields.push('relation = $' + (fields.length + 1));
        values.push(relation);
    }
    if (dob) {
        fields.push('dob = $' + (fields.length + 1));
        values.push(dob);
    }
    if (gender) {
        fields.push('gender = $' + (fields.length + 1));
        values.push(gender);
    }
    if (bloodGroup) {
        fields.push('blood_group = $' + (fields.length + 1));
        values.push(bloodGroup);
    }
    if (height) {
        fields.push('height = $' + (fields.length + 1));
        values.push(height);
    }
    if (weight) {
        fields.push('weight = $' + (fields.length + 1));
        values.push(weight);
    }

    query += fields.join(', ') + ' WHERE id = $' + (fields.length + 1) + ' RETURNING *';
    values.push(familyId);

    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('Family member not found or no changes made');
    }

    return result.rows[0];
};
