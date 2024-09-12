const express = require('express');
const doctorController = require('../controllers/doctorController');
const upload = require('../middlewares/upload'); 

const router = express.Router();

router.post('/register', upload.single('documentName'), doctorController.registerDoctor);
router.put('/update-status/:id', doctorController.updateDoctorStatus); 
// router.get('/doctor-specialities', doctorController.getDoctorSpecialities);

module.exports = router;
