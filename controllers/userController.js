const userService = require('../services/userServices');


exports.register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
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
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const updatedUser = await userService.updateUser(userId, req.body);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.addFamilyMember = async (req, res) => {
    try {
        const userId = req.params.userId;
        const familyMember = await userService.addFamilyMember(userId, req.body);
        res.status(201).json(familyMember);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.updateFamilyMember = async (req, res) => {
    try {
        const familyId = req.params.familyId;
        const updatedFamilyMember = await userService.updateFamilyMember(familyId, req.body);
        res.status(200).json(updatedFamilyMember);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
