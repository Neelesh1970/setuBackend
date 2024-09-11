const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory for UserJobProfile
const uploadDir = path.join(__dirname, '../uploads/UserJobProfile');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/UserJobProfile'); 

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`); // Generate unique filename
    }
});

// File filter to allow only specific types (images and PDF)
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Define allowed file types
        const filetypes = /jpeg|jpg|png|gif|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true); // Allow the file if it matches the types
        } else {
            cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
        }
    }
});

module.exports = upload;
