const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user', userController.getAllUsers);  
router.get('/user/:id', userController.getUserById);
router.put('/update/:id', upload.single('profile_photo'), userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);



// Example of a protected route
router.get('/profile', auth.authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
