const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); 

// CRUD Routes
router.post('/login', userController.loginUser); // Login
router.post('/', userController.createUser);
//router.post('/create', userController.createUser);

router.use(authMiddleware); // Todas las rutas siguientes requieren autenticación

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
