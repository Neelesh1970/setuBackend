const userJobProfileService = require('../services/userJobProfileService');


exports.createOrUpdateProfile = async (req, res) => {
    const user_id = req.params.id;
    const files = req.files;

    try {
        const result = await userJobProfileService.createOrUpdateUserProfile(user_id, req.body, files);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getProfile = async (req, res) => {
    const user_id = req.params.id;

    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid user_id' });
    }

    try {
        const profile = await userJobProfileService.getUserProfile(user_id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
