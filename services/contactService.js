const pool = require('../config/db');

exports.insertContacts = async (userId, contacts) => {
    const newContacts = [
        { name: contacts.contact1_name, phone_number: contacts.contact1_phone_number, relation: contacts.contact1_relation },
        { name: contacts.contact2_name, phone_number: contacts.contact2_phone_number, relation: contacts.contact2_relation },
        { name: contacts.contact3_name, phone_number: contacts.contact3_phone_number, relation: contacts.contact3_relation },
        { name: contacts.contact4_name, phone_number: contacts.contact4_phone_number, relation: contacts.contact4_relation }
    ];

    const nonNullContacts = newContacts.filter(contact =>
        contact.name || contact.phone_number || contact.relation
    );

    if (!userId) {
        throw new Error('user_id is required');
    }

    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rowCount === 0) {
        throw new Error('User not found');
    }

    const existingContacts = await pool.query('SELECT * FROM emergency_contacts WHERE user_id = $1', [userId]);

    const existing = existingContacts.rows[0] || {};
    const existingContactFields = [
        { name: existing.contact1_name, phone_number: existing.contact1_phone_number, relation: existing.contact1_relation },
        { name: existing.contact2_name, phone_number: existing.contact2_phone_number, relation: existing.contact2_relation },
        { name: existing.contact3_name, phone_number: existing.contact3_phone_number, relation: existing.contact3_relation },
        { name: existing.contact4_name, phone_number: existing.contact4_phone_number, relation: existing.contact4_relation }
    ];

    const completeExistingContacts = existingContactFields.filter(contact =>
        contact.name && contact.phone_number && contact.relation
    ).length;

    if (completeExistingContacts === 4 && nonNullContacts.length > 0) {
        throw new Error('Cannot add a 5th contact. All 4 contact slots are already filled.');
    }

    const values = [
        userId,
        contacts.contact1_name || existing.contact1_name || null, contacts.contact1_phone_number || existing.contact1_phone_number || null, contacts.contact1_relation || existing.contact1_relation || null,
        contacts.contact2_name || existing.contact2_name || null, contacts.contact2_phone_number || existing.contact2_phone_number || null, contacts.contact2_relation || existing.contact2_relation || null,
        contacts.contact3_name || existing.contact3_name || null, contacts.contact3_phone_number || existing.contact3_phone_number || null, contacts.contact3_relation || existing.contact3_relation || null,
        contacts.contact4_name || existing.contact4_name || null, contacts.contact4_phone_number || existing.contact4_phone_number || null, contacts.contact4_relation || existing.contact4_relation || null
    ];

    await pool.query(
        `INSERT INTO emergency_contacts (
            user_id, contact1_name, contact1_phone_number, contact1_relation,
            contact2_name, contact2_phone_number, contact2_relation,
            contact3_name, contact3_phone_number, contact3_relation,
            contact4_name, contact4_phone_number, contact4_relation
        ) VALUES (
            $1, $2, $3, $4,
            $5, $6, $7,
            $8, $9, $10,
            $11, $12, $13
        )
        ON CONFLICT (user_id) DO UPDATE
        SET
            contact1_name = COALESCE(EXCLUDED.contact1_name, emergency_contacts.contact1_name),
            contact1_phone_number = COALESCE(EXCLUDED.contact1_phone_number, emergency_contacts.contact1_phone_number),
            contact1_relation = COALESCE(EXCLUDED.contact1_relation, emergency_contacts.contact1_relation),
            contact2_name = COALESCE(EXCLUDED.contact2_name, emergency_contacts.contact2_name),
            contact2_phone_number = COALESCE(EXCLUDED.contact2_phone_number, emergency_contacts.contact2_phone_number),
            contact2_relation = COALESCE(EXCLUDED.contact2_relation, emergency_contacts.contact2_relation),
            contact3_name = COALESCE(EXCLUDED.contact3_name, emergency_contacts.contact3_name),
            contact3_phone_number = COALESCE(EXCLUDED.contact3_phone_number, emergency_contacts.contact3_phone_number),
            contact3_relation = COALESCE(EXCLUDED.contact3_relation, emergency_contacts.contact3_relation),
            contact4_name = COALESCE(EXCLUDED.contact4_name, emergency_contacts.contact4_name),
            contact4_phone_number = COALESCE(EXCLUDED.contact4_phone_number, emergency_contacts.contact4_phone_number),
            contact4_relation = COALESCE(EXCLUDED.contact4_relation, emergency_contacts.contact4_relation),
            updated_at = CURRENT_TIMESTAMP`, values);
};

exports.deleteContact = async (userId, contactNumber) => {
    if (!userId) {
        throw new Error('user_id is required');
    }

    const userCheck = await pool.query('SELECT user_id FROM users WHERE user_id = $1', [userId]);
    if (userCheck.rowCount === 0) {
        throw new Error('User not found');
    }

    const contactColumn = `contact${contactNumber}_name`;

    await pool.query(`
        UPDATE emergency_contacts
        SET
            ${contactColumn} = NULL,
            ${contactColumn.replace('_name', '_phone_number')} = NULL,
            ${contactColumn.replace('_name', '_relation')} = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
    `, [userId]);
};

exports.getEmergencyContacts = async (userId) => {
    if (!userId) {
        throw new Error('user_id is required');
    }

    const userCheck = await pool.query('SELECT user_id FROM users WHERE user_id = $1', [userId]);
    if (userCheck.rowCount === 0) {
        throw new Error('User not found');
    }

    const contacts = await pool.query(`
        SELECT
            contact1_name, contact1_phone_number, contact1_relation,
            contact2_name, contact2_phone_number, contact2_relation,
            contact3_name, contact3_phone_number, contact3_relation,
            contact4_name, contact4_phone_number, contact4_relation
        FROM emergency_contacts
        WHERE user_id = $1
    `, [userId]);

    if (contacts.rowCount === 0) {
        throw new Error('No contacts found for this user');
    }

    const contactData = contacts.rows[0];
    return Object.fromEntries(
        Object.entries(contactData).filter(([key, value]) => value !== null)
    );
};
