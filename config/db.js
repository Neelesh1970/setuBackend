const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'esetubackend',
    password: 'root',
    port: 5434,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

module.exports = pool;
