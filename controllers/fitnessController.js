const fitnessService = require('../services/fitnessService');


exports.createLiveStream = async (req, res) => {
    try {
        const imagePath = req.file ? req.file.filename : null;
        const result = await fitnessService.createLiveStream(req.body, imagePath);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.createHealthEvent = async (req, res) => {
    try {
        const imagePath = req.file ? req.file.filename : null;
        const result = await fitnessService.createHealthEvent(req.body, imagePath);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
