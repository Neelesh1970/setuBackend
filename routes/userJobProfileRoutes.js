const express = require('express');
const userJobProfileController = require('../controllers/userJobProfileController');
const multer = require('multer');
const path = require('path');

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/UserJobProfile/')); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });


router.post('/user-job-profile/:id', upload.fields([
    { name: 'resume_file', maxCount: 1 },
    { name: 'profile_picture', maxCount: 1 }
]), userJobProfileController.createOrUpdateProfile);

router.get('/user-job-profile/:id', userJobProfileController.getProfile);

module.exports = router;
