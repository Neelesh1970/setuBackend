const pool = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');


exports.registerVendor = async (vendorData) => {
    const {
        organization_name,
        type_of_service,
        establishment_date,
        gst_no,
        company_address,
        postal_code,
        city,
        state,
        country,
        bank_name,
        beneficiary_name,
        account_number,
        ifsc_code
    } = vendorData;

    
    const encryptedAccountNumber = encrypt(account_number);
    const encryptedIFSCCode = encrypt(ifsc_code);

    const result = await pool.query(
        `INSERT INTO vendors (organization_name, type_of_service, establishment_date, gst_no, company_address, postal_code, city, state, country, bank_name, beneficiary_name, account_number, ifsc_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
         RETURNING id, organization_name, type_of_service, establishment_date, gst_no, company_address, postal_code, city, state, country, bank_name, beneficiary_name, account_number, ifsc_code, created_at`,
        [
            organization_name,
            type_of_service,
            establishment_date,
            gst_no,
            company_address,
            postal_code,
            city,
            state,
            country,
            bank_name,
            beneficiary_name,
            encryptedAccountNumber,
            encryptedIFSCCode
        ]
    );

    return result.rows[0];
};


exports.getVendorById = async (id) => {
    const result = await pool.query('SELECT * FROM vendors WHERE id = $1', [id]);

    if (result.rows.length > 0) {
        const vendor = result.rows[0];
        vendor.account_number = decrypt(vendor.account_number);
        vendor.ifsc_code = decrypt(vendor.ifsc_code);
        return vendor;
    }
    throw new Error('Vendor not found');
};


exports.updateVendor = async (id, updateData) => {
    const {
        organization_name, type_of_service, establishment_date, gst_no, company_address, postal_code, city, state, country, 
        bank_name, beneficiary_name, account_number, ifsc_code, valid_documents 
    } = updateData;

    const encryptedAccountNumber = encrypt(account_number);
    const encryptedIfscCode = encrypt(ifsc_code);

    await pool.query(
        `UPDATE vendors SET organization_name = $1, type_of_service = $2, establishment_date = $3, gst_no = $4, company_address = $5, 
        postal_code = $6, city = $7, state = $8, country = $9, bank_name = $10, beneficiary_name = $11, account_number = $12, 
        ifsc_code = $13, valid_documents = $14, updated_at = NOW() WHERE id = $15`,
        [organization_name, type_of_service, establishment_date, gst_no, company_address, postal_code, city, state, country, 
        bank_name, beneficiary_name, encryptedAccountNumber, encryptedIfscCode, valid_documents, id]
    );
};


exports.deleteVendor = async (id) => {
    await pool.query('DELETE FROM vendors WHERE id = $1', [id]);
};
