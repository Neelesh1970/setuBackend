const pool = require('../config/db');
const fs = require('fs');
const path = require('path');


exports.createLiveStream = async (streamData, imagePath) => {
    const { date, time, title, category, description, video_url, is_live } = streamData;

    
    let missingFields = [];
    if (!title) missingFields.push('Title');
    if (!video_url) missingFields.push('Video URL');
    if (!date) missingFields.push('Date');
    if (!time) missingFields.push('Time');
    if (!is_live) missingFields.push('Is Live');
    if (!imagePath) missingFields.push('Image');

    if (missingFields.length > 0) {
        throw new Error(`This field is required: ${missingFields.join(', ')}`);
    }

    
    const result = await pool.query(
        `INSERT INTO live_streaming (date, time, title, image, category, description, video_url, is_live)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, date, time, title, image, category, description, video_url, is_live, status, created_time`,
        [date, time, title, imagePath, category, description, video_url, is_live]
    );
    return result.rows[0];
};


exports.createHealthEvent = async (eventData, imagePath) => {
    const { title, category, description, video_url, is_live, is_popular, status, date, time } = eventData;

    
    let missingFields = [];
    if (!title) missingFields.push('Title');
    if (!description) missingFields.push('Description');
    if (!date) missingFields.push('Date');
    if (!time) missingFields.push('Time');
    if (!is_popular) missingFields.push('Is Popular');
    if (!imagePath) missingFields.push('Image');

    if (missingFields.length > 0) {
        throw new Error(`This field is required: ${missingFields.join(', ')}`);
    }

    
    const result = await pool.query(
        `INSERT INTO health_events (title, category, image, description, video_url, is_live, is_popular, status, date, time)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, title, category, image, description, video_url, is_live, is_popular, status, date, time, created_time, updated_time`,
        [title, category, imagePath, description, video_url, is_live || false, is_popular || false, status || 'Active', date, time]
    );
    return result.rows[0];
};
