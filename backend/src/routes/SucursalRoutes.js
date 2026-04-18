const { Router } = require('express');
const { body, param } = require('express-validator');
const SucursalController = require('../controllers/SucursalController');

const router = Router();

const validarParamId = [
    param('id')
    .isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
    .toInt(),
];

const validarCreacion = [
    body('id_ciudad')
    .isInt({ min: 1 }).withMessage('id_ciudad debe ser un entero positivo')
    .toInt(),

    body('nombre_sucursal')
    .trim()
    .notEmpty().withMessage('nombre_sucursal es requerido')
    .isLength({ max: 100 }).withMessage('nombre_sucursal no puede superar los 100 caracteres'),

    body('direccion')
    .trim()
    .notEmpty().withMessage('direccion es requerida'),
];

const validarActualizacion = [
    body('id_ciudad')
    .optional()
    .isInt({ min: 1 }).withMessage('id_ciudad debe ser un entero positivo')
    .toInt(),

    body('nombre_sucursal')
    .optional()
    .trim()
    .notEmpty().withMessage('nombre_sucursal no puede estar vacío')
    .isLength({ max: 100 }).withMessage('nombre_sucursal no puede superar los 100 caracteres'),

    body('direccion')
    .optional()
    .trim()
    .notEmpty().withMessage('direccion no puede estar vacía'),
];

// ─── Rutas ─────

// GET    /api/sucursales
router.get('/', SucursalController.obtenerTodas);

// GET    /api/sucursales/:id
router.get('/:id', validarParamId, SucursalController.obtenerPorId);

// POST   /api/sucursales
router.post('/', validarCreacion, SucursalController.crear);

// PUT    /api/sucursales/:id
router.put('/:id', validarParamId, validarActualizacion, SucursalController.actualizar);

// DELETE /api/sucursales/:id
router.delete('/:id', validarParamId, SucursalController.eliminar);

module.exports = router;