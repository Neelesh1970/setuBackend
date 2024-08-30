const userService = require('../services/userServices');


exports.register = async (req, res) => {
    try{
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


exports.login = async (req, res) => {
    try{
        const result = await userService.loginUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const result = await userService.getUserById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};