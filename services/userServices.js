const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const pool = require('../config/db');

exports.registerUser = async (userData) => {
    const { password, confirmPassword } = userData;
    
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    userData.password = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(userData);
    
    return { id: newUser.id, email: newUser.email };
};

exports.loginUser = async (loginData) => {
    const { email, password } = loginData;
    const user = await userModel.findUserByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    
    return { token };
};


exports.getAllUsers = async () => {
    const users = await pool.query('SELECT * FROM users');
    return users.rows;
};

exports.getUserById = async (id) => {
    if (!id) {
        throw new Error('Please provide an ID');
    }

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (user.rows.length === 0) {
        throw new Error('User not found');
    }

    return user.rows[0];
};
