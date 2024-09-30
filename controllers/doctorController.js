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

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorService.getAllDoctors();
        res.status(200).json({ data: doctors });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDoctorById = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await doctorService.getDoctorById(id);
        res.status(200).json({ data: doctor });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.updateDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await doctorService.updateDoctor(id, req.body);
        if (result === 0) {
            throw new Error('Doctor not found');
        }
        res.status(200).json({ message: 'Doctor details updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await doctorService.deleteDoctor(id);
        if (result === 0) {
            throw new Error('Doctor not found');
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


