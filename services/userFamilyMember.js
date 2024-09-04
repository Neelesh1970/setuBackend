const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const pool = require('../config/db');

const fs = require('fs');
const path = require('path');
const multer = require('multer');


exports.addFamilyMember = async (userId, familyData, file) => {
    const { firstName, lastName, relation, dob, gender, bloodGroup, height, weight } = familyData;

    if (!firstName) throw new Error('First Name is required');
    if (!lastName) throw new Error('Last Name is required');
    if (!relation) throw new Error('Relation is required');
    if (!dob) throw new Error('Date of Birth is required');
    if (!gender) throw new Error('Gender is required');

    const filePath = file ? path.join('uploads', file.filename) : null;

    const result = await pool.query(
        `INSERT INTO family_members (user_id, first_name, last_name, relation, dob, gender, blood_group, height, weight, profile_photo, isActive)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, first_name, last_name, relation, dob, gender, blood_group, height, weight, profile_photo, isActive, created_at`,
        [userId, firstName, lastName, relation, dob, gender, bloodGroup, height, weight, filePath, true]
    );

    return result.rows[0];
};

exports.getFamilyDetails = async (userId) => {
    const result = await pool.query(
        `SELECT id, first_name, last_name, relation, dob, gender, blood_group, height, weight, profile_photo, isActive, created_at 
         FROM family_members 
         WHERE user_id = $1`,
        [userId]
    );

    return result.rows;
};

exports.deleteFamilyMember = async (id) => {
    
    const result = await pool.query('DELETE FROM family_members WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
        throw new Error('Family member not found');
    }

    return { message: `Family member with ID ${id} has been deleted` };
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
