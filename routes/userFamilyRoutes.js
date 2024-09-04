const express = require('express');
const userFamilyController = require('../controllers/userFamilyController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/addFamilyMember/:userId', upload.single('profile_photo'), userFamilyController.addFamilyMember);
router.delete('/deleteFamily/:id', userFamilyController.deleteFamilyMember);
router.put('/update/:userId/family/:familyId', userFamilyController.updateFamilyMember);
router.get('/users/:userId/family', userFamilyController.getFamilyDetailsByUserId);



// Example of a protected route
router.get('/profile', auth.authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;