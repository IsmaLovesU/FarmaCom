const { Router } = require('express');
const { body, param } = require('express-validator');
const PresentacionController = require('../controllers/PresentacionController');
const verificarToken         = require('../middlewares/verificarToken');
const verificarRol           = require('../middlewares/verificarRol');

const router = Router();

// ── validadores ───────────────────────────────────────────────────────────────

const validarParamId = [
  param('id')
    .isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
    .toInt(),
];

const validarActualizacion = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),

  body('factor_conversion')
    .optional()
    .isFloat({ min: 1 }).withMessage('El factor de conversión debe ser mayor o igual a 1')
    .toFloat(),

  body('es_base')
    .optional()
    .isBoolean().withMessage('es_base debe ser un booleano')
    .toBoolean(),

  body('forzar_cambio_base')
    .optional()
    .isBoolean().withMessage('forzar_cambio_base debe ser un booleano')
    .toBoolean(),
];

const validarCambioEstado = [
  body('activo')
    .isBoolean().withMessage('El campo "activo" debe ser un booleano')
    .toBoolean(),
];

// ── rutas ─────────────────────────────────────────────────────────────────────

// GET    /api/presentaciones/:id
router.get('/:id',
  verificarToken,
  verificarRol('dueno', 'administrador', 'dependiente'),
  validarParamId,
  PresentacionController.obtenerPorId,
);

// PUT    /api/presentaciones/:id
router.put('/:id',
  verificarToken,
  verificarRol('dueno', 'administrador', 'dependiente'),
  validarParamId,
  validarActualizacion,
  PresentacionController.actualizar,
);

// PATCH  /api/presentaciones/:id/estado
router.patch('/:id/estado',
  verificarToken,
  verificarRol('dueno', 'administrador', 'dependiente'),
  validarParamId,
  validarCambioEstado,
  PresentacionController.cambiarEstado,
);

module.exports = router;