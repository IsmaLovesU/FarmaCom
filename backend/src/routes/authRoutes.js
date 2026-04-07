const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/AuthController');

const router = Router();

const validarLogin = [
    body('correo_usuario').isEmail().withMessage('correo_usuario no es válido'),
    body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
];

// POST /api/auth/login
router.post('/login', validarLogin, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;