const { Router } = require('express');
const { body, param } = require('express-validator');
const CategoriaController = require('../controllers/CategoriaController');
const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

const router = Router();

const validarParamId = [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo').toInt(),
];

const validarCreacion = [
    body('nombre_categoria')
    .trim()
    .notEmpty().withMessage('nombre_categoria es requerido')
    .isLength({ max: 100 }).withMessage('nombre_categoria no puede superar los 100 caracteres'),

    body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('descripcion no puede superar los 255 caracteres'),
];

const validarActualizacion = [
    body('nombre_categoria')
    .optional()
    .trim()
    .notEmpty().withMessage('nombre_categoria no puede estar vacío')
    .isLength({ max: 100 }).withMessage('nombre_categoria no puede superar los 100 caracteres'),

    body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('descripcion no puede superar los 255 caracteres'),
];

// GET    /api/categorias
router.get('/', verificarToken, CategoriaController.obtenerTodas);

// GET    /api/categorias/:id
router.get('/:id', verificarToken, validarParamId, CategoriaController.obtenerPorId);

// POST   /api/categorias
router.post(
    '/',
    verificarToken,
    verificarRol('dueno', 'administrador'),
    validarCreacion,
    CategoriaController.crear,
);

// PUT    /api/categorias/:id
router.put(
    '/:id',
    verificarToken,
    verificarRol('dueno', 'administrador'),
    validarParamId,
    validarActualizacion,
    CategoriaController.actualizar,
);

// DELETE /api/categorias/:id
router.delete(
    '/:id',
    verificarToken,
    verificarRol('dueno'),
    validarParamId,
    CategoriaController.eliminar,
);

module.exports = router;