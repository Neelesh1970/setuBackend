const pool = require('../config/db'); 
const path = require('path');

exports.createOrUpdateUserProfile = async (user_id, userData, files) => {
    const { position, company, education_degree, education_field, skills, isActive, experience } = userData;

    
    const resume_file = files['resume_file'] ? files['resume_file'][0].buffer : null;
    const profile_picture = files['profile_picture'] ? files['profile_picture'][0].buffer : null;

    try {
        
        const userResult = await pool.query('SELECT u.username FROM users u WHERE u.id = $1', [user_id]);

        if (userResult.rowCount === 0) {
            throw new Error('User not found');
        }

        const username = userResult.rows[0].username;

        
        const profileExistsResult = await pool.query('SELECT user_id FROM user_job_profile WHERE user_id = $1', [user_id]);

        if (profileExistsResult.rowCount > 0) {
            
            await pool.query(
                `UPDATE user_job_profile
                SET position = $1, company = $2, education_degree = $3, education_field = $4, skills = $5, resume_file = $6, profile_picture = $7, isActive = $8, experience = $9, updated_at = $10
                WHERE user_id = $11`,
                [position, company, education_degree, education_field, skills, resume_file, profile_picture, isActive !== undefined ? isActive : true, experience, new Date(), user_id]
            );
            return { message: 'Profile updated successfully' };
        } else {
            
            await pool.query(
                `INSERT INTO user_job_profile (user_id, name, position, company, education_degree, education_field, skills, resume_file, profile_picture, isActive, experience)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [user_id, username, position, company, education_degree, education_field, skills, resume_file, profile_picture, isActive !== undefined ? isActive : true, experience]
            );
            return { message: 'Profile created successfully' };
        }
    } catch (error) {
        throw new Error('Error creating/updating profile: ' + error.message);
    }
};

exports.getUserProfile = async (user_id) => {
    try {
        const result = await pool.query('SELECT * FROM user_job_profile WHERE user_id = $1', [user_id]);

        if (result.rowCount === 0) {
            throw new Error('Profile not found');
        }

        return result.rows[0];
    } catch (error) {
        throw new Error('Error fetching profile: ' + error.message);
    }
};

