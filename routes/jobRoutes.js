const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

// Routes for job search and fetching all jobs
router.get('/search-jobs', jobController.searchJobs);
router.get('/all-jobs', jobController.getAllJobs);

module.exports = router;
