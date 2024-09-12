const doctorService = require('../services/doctorService');


exports.registerDoctor = async (req, res) => {
    try {
        const result = await doctorService.registerDoctor(req.body, req.file);
        res.status(201).json({ message: 'Registration successful', data: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.updateDoctorStatus = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        await doctorService.updateDoctorStatus(id, isActive);
        res.status(200).json({ message: 'Doctor status updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

