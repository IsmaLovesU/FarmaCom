const { Router } = require('express');
const { body } = require('express-validator');
const CorreoSucursalController = require('../controllers/CorreoSucursalController');
const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

const router = Router({ mergeParams: true });

const validarCreacion = [
    body('correo')
    .notEmpty().withMessage('El correo es requerido')
    .isEmail().withMessage('El correo no tiene un formato válido'),
];

const validarActualizacion = [
    body('correo')
    .optional()
    .isEmail().withMessage('El correo no tiene un formato válido'),
];

// GET    /api/sucursales/:id_sucursal/correos
router.get('/', verificarToken, CorreoSucursalController.obtenerPorSucursal);

// POST   /api/sucursales/:id_sucursal/correos
router.post('/', verificarToken, verificarRol('dueno', 'administrador'), validarCreacion, CorreoSucursalController.crear);

// GET    /api/correos/:id
router.get('/:id', verificarToken, CorreoSucursalController.obtenerPorId);

// PUT    /api/correos/:id
router.put('/:id', verificarToken, verificarRol('dueno', 'administrador'), validarActualizacion, CorreoSucursalController.actualizar);

// DELETE /api/correos/:id
router.delete('/:id', verificarToken, verificarRol('dueno', 'administrador'), CorreoSucursalController.eliminar);

module.exports = router;