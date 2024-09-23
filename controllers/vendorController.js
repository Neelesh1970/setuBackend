const vendorService = require('../services/vendorService');


exports.registerVendor = async (req, res) => {
    try {
        const result = await vendorService.registerVendor(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getVendorById = async (req, res) => {
    try {
        const result = await vendorService.getVendorById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};


exports.updateVendor = async (req, res) => {
    try {
        await vendorService.updateVendor(req.params.id, req.body);
        res.status(200).json({ message: 'Vendor updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.deleteVendor = async (req, res) => {
    try {
        await vendorService.deleteVendor(req.params.id);
        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
