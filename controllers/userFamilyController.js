const userFamilyMember = require('../services/userFamilyMember');

exports.addFamilyMember = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const newFamilyMember = await userFamilyMember.addFamilyMember(userId, req.body, req.file);
        res.status(201).json(newFamilyMember);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getFamilyDetailsByUserId = async (req, res) => {
    try {
        const familyDetails = await userFamilyMember.getFamilyDetails(req.params.userId);
        if (familyDetails.length === 0) {
            return res.status(404).json({ message: 'No family members found for this user' });
        }
        res.status(200).json(familyDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteFamilyMember = async (req, res) => {
    try {
        const familyMemberId = req.params.id;
        const response = await userFamilyMember.deleteFamilyMember(familyMemberId);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateFamilyMember = async (req, res) => {
    try {
        const familyId = req.params.familyId;
        const updatedFamilyMember = await userFamilyMember.updateFamilyMember(familyId, req.body);
        res.status(200).json(updatedFamilyMember);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};