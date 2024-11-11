const express = require('express');
const router = express.Router();
const bankAccountController = require('../controllers/bankAccountController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', bankAccountController.createBankAccount);
router.get('/', bankAccountController.getBankAccounts);
router.get('/:id', bankAccountController.getBankAccount);
router.put('/:id', bankAccountController.updateBankAccount);
router.delete('/:id', bankAccountController.deleteBankAccount);

module.exports = router;
