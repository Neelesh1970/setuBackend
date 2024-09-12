const pool = require('../config/db'); 


exports.registerDoctor = async (doctorData, file) => {
    const { firstName, lastName, email, phoneNumber, regNo, clinicName, clinicAddress, qualificationSpecialization, servicesOffered, isActive } = doctorData;

   
    let missingFields = [];
    if (!firstName) missingFields.push('First Name');
    if (!lastName) missingFields.push('Last Name');
    if (!email) missingFields.push('Email');
    if (!phoneNumber) missingFields.push('Phone Number');
    if (!regNo) missingFields.push('Registration Number');
    if (!clinicName) missingFields.push('Clinic Name');
    if (!clinicAddress) missingFields.push('Clinic Address');
    if (!qualificationSpecialization) missingFields.push('Qualification/Specialization');
    if (!servicesOffered) missingFields.push('Services Offered');

    if (missingFields.length > 0) {
        throw new Error(`This field is required: ${missingFields.join(', ')}`);
    }

    if (!file) {
        throw new Error('Document upload is required.');
    }

    const documentName = file.filename; 

    
    const query = `
        INSERT INTO doctor_register (
            first_name, last_name, email_id, phone_number, reg_no, 
            clinic_name, clinic_address, specialization, 
            services_offered, files, isActive
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    const values = [
        firstName,
        lastName,
        email,
        phoneNumber,
        regNo,
        clinicName,
        clinicAddress,
        qualificationSpecialization,
        servicesOffered,
        documentName,
        isActive || true 
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


exports.updateDoctorStatus = async (doctorId, isActive) => {
    const query = `
        UPDATE doctor_register
        SET isActive = $1
        WHERE id = $2
    `;
    const values = [isActive, doctorId];
    await pool.query(query, values);
};
