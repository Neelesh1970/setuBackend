const express = require('express');
const fitnessController = require('../controllers/fitnessController');
const upload = require('../middlewares/upload');

const router = express.Router();


router.post('/live-streams', upload.single('image'), fitnessController.createLiveStream);


router.post('/health-events', upload.single('image'), fitnessController.createHealthEvent);

module.exports = router;
