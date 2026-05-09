const { Router } = require('express');
const { body, param } = require('express-validator');
const CasaFarmaceuticaController = require('../controllers/CasaFarmaceuticaController');
const CasaTelefonoController = require('../controllers/CasaTelefonoController');
const CasaEmailController = require('../controllers/CasaEmailController');
const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

const router = Router();

// Validadores

const validarParamId = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo').toInt(),
];

const validarCreacion = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('nombre es requerido')
    .isLength({ max: 150 }).withMessage('nombre no puede superar los 150 caracteres'),
];

const validarActualizacion = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('nombre no puede estar vacío')
    .isLength({ max: 150 }).withMessage('nombre no puede superar los 150 caracteres'),
];

const validarTelefonoCreacion = [
  body('numero')
    .notEmpty().withMessage('El número es requerido')
    .isLength({ max: 20 }).withMessage('El número no puede superar los 20 caracteres'),
];

const validarTelefonoActualizacion = [
  body('numero')
    .optional()
    .notEmpty().withMessage('El número no puede estar vacío')
    .isLength({ max: 20 }).withMessage('El número no puede superar los 20 caracteres'),
];

const validarEmailCreacion = [
  body('correo')
    .notEmpty().withMessage('El correo es requerido')
    .isEmail().withMessage('El correo no tiene un formato válido'),
];

const validarEmailActualizacion = [
  body('correo')
    .optional()
    .isEmail().withMessage('El correo no tiene un formato válido'),
];

// Rutas: CasaFarmaceutica

// GET    /api/casas
router.get('/', verificarToken, CasaFarmaceuticaController.obtenerTodas);

// GET    /api/casas/:id
router.get('/:id', verificarToken, validarParamId, CasaFarmaceuticaController.obtenerPorId);

// POST   /api/casas
router.post(
  '/',
  verificarToken,
  verificarRol('dueno', 'administrador'),
  validarCreacion,
  CasaFarmaceuticaController.crear,
);

// PUT    /api/casas/:id
router.put(
  '/:id',
  verificarToken,
  verificarRol('dueno', 'administrador'),
  validarParamId,
  validarActualizacion,
  CasaFarmaceuticaController.actualizar,
);

// PATCH  /api/casas/:id/estado
router.patch(
  '/:id/estado',
  verificarToken,
  verificarRol('dueno', 'administrador'),
  validarParamId,
  CasaFarmaceuticaController.cambiarEstado,
);

// DELETE /api/casas/:id
router.delete(
  '/:id',
  verificarToken,
  verificarRol('dueno'),
  validarParamId,
  CasaFarmaceuticaController.eliminar,
);


module.exports = router;