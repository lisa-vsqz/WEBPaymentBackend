const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', providerController.createProvider);
router.get('/', providerController.getProviders);
router.get('/:id', providerController.getProvider);
router.put('/:id', providerController.updateProvider);
router.delete('/:id', providerController.deleteProvider);

module.exports = router;
