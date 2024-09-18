const jobService = require('../services/jobService');


exports.searchJobs = async (req, res) => {
    try {
        console.log('Query parameters:', req.query);
        const result = await jobService.searchJobs(req.query);

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'No jobs found for the specified criteria' });
        }
    } catch (err) {
        console.error('Error searching jobs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getAllJobs = async (req, res) => {
    try {
        const result = await jobService.getAllJobs();
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'No jobs found' });
        }
    } catch (err) {
        console.error('Error fetching all jobs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
