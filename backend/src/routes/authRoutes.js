const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/AuthController');
const verificarToken = require('../middlewares/verificarToken');

const router = Router();

const validarLogin = [
    body('correo_usuario').isEmail().withMessage('correo_usuario no es válido'),
    body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
];

router.post('/login', validarLogin, authController.login);

router.post('/logout', authController.logout);

router.get('/me', verificarToken, authController.me);

module.exports = router;
