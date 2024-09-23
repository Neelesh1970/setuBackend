const express = require('express');
const vendorController = require('../controllers/vendorController');
const upload = require('../middlewares/upload'); 

const router = express.Router();

router.post('/vendor', upload.single('valid_documents'), vendorController.registerVendor);
router.get('/vendor/:id', vendorController.getVendorById);
router.put('/vendor/:id', upload.single('valid_documents'), vendorController.updateVendor);
router.delete('/vendor/:id', vendorController.deleteVendor);

module.exports = router;
