const express = require('express');
const router = express.Router();
const providerHistoryController = require('../controllers/providerHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', providerHistoryController.createProviderHistory);
router.get('/', providerHistoryController.getProviderHistories);
router.get('/:id', providerHistoryController.getProviderHistory);
router.put('/:id', providerHistoryController.updateProviderHistory);
router.delete('/:id', providerHistoryController.deleteProviderHistory);

module.exports = router;
