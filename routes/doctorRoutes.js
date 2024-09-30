const express = require('express');
const doctorController = require('../controllers/doctorController');
const upload = require('../middlewares/upload'); 

const router = express.Router();

router.post('/register', upload.single('documentName'), doctorController.registerDoctor);
router.put('/update-status/:id', doctorController.updateDoctorStatus);
router.put('/update/:id', doctorController.updateDoctor);
router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.delete('/delete/:id', doctorController.deleteDoctor);

module.exports = router;
