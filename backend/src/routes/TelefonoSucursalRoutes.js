const { Router } = require('express');
const { body } = require('express-validator');
const TelefonoSucursalController = require('../controllers/TelefonoSucursalController');
const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

const router = Router({ mergeParams: true });

const validarCreacion = [
    body('numero')
    .notEmpty().withMessage('El número es requerido')
    .isLength({ max: 20 }).withMessage('El número no puede superar los 20 caracteres'),
];

const validarActualizacion = [
    body('numero')
    .optional()
    .notEmpty().withMessage('El número no puede estar vacío')
    .isLength({ max: 20 }).withMessage('El número no puede superar los 20 caracteres'),
];

// GET    /api/sucursales/:id_sucursal/telefonos
router.get('/', verificarToken, TelefonoSucursalController.obtenerPorSucursal);

// POST   /api/sucursales/:id_sucursal/telefonos
router.post('/', verificarToken, verificarRol('dueno', 'administrador'), validarCreacion, TelefonoSucursalController.crear);

// GET    /api/telefonos/:id
router.get('/:id', verificarToken, TelefonoSucursalController.obtenerPorId);

// PUT    /api/telefonos/:id
router.put('/:id', verificarToken, verificarRol('dueno', 'administrador'), validarActualizacion, TelefonoSucursalController.actualizar);

// DELETE /api/telefonos/:id
router.delete('/:id', verificarToken, verificarRol('dueno', 'administrador'), TelefonoSucursalController.eliminar);

module.exports = router;