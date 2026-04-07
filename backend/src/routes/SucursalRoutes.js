const { Router } = require('express');
const { body } = require('express-validator');
const SucursalController = require('../controllers/SucursalController');

const router = Router();

const validarCreacion = [
  body('id_ciudad').isInt({ min: 1 }).withMessage('id_ciudad debe ser un entero positivo'),
  body('nombre_sucursal').notEmpty().withMessage('nombre_sucursal es requerido'),
  body('direccion').notEmpty().withMessage('direccion es requerida'),
];

const validarActualizacion = [
  body('id_ciudad').optional().isInt({ min: 1 }).withMessage('id_ciudad debe ser un entero positivo'),
  body('nombre_sucursal').optional().notEmpty().withMessage('nombre_sucursal no puede estar vacío'),
  body('direccion').optional().notEmpty().withMessage('direccion no puede estar vacía'),
];

// GET    /api/sucursales
router.get('/', SucursalController.obtenerTodas);

// GET    /api/sucursales/:id
router.get('/:id', SucursalController.obtenerPorId);

// POST   /api/sucursales
router.post('/', validarCreacion, SucursalController.crear);

// PUT    /api/sucursales/:id
router.put('/:id', validarActualizacion, SucursalController.actualizar);

// DELETE /api/sucursales/:id
router.delete('/:id', SucursalController.eliminar);

module.exports = router;