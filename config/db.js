const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'esetudb.c744kok0y79g.ap-south-1.rds.amazonaws.com',
    database: 'esetubackend',
    password: 'postgres123',
    port: 5432,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

module.exports = pool;
