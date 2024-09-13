const contactService = require('../services/contactService');

exports.insertContacts = async (req, res) => {
    const userId = req.params.id;
    const contacts = req.body;

    try {
        await contactService.insertContacts(userId, contacts);
        res.status(200).json({ message: 'Contacts inserted or updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteContact = async (req, res) => {
    const userId = req.params.id;
    const contactNumber = req.query.contactNumber;

    try {
        await contactService.deleteContact(userId, contactNumber);
        res.status(200).json({ message: `Contact ${contactNumber} has been deleted` });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getEmergencyContacts = async (req, res) => {
    const userId = req.params.id;

    try {
        const contacts = await contactService.getEmergencyContacts(userId);
        res.status(200).json({ contacts });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
