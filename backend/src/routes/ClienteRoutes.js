const { Router } = require('express');
const { body, param } = require('express-validator');
const ClienteController = require('../controllers/ClienteController');
const verificarToken = require('../middlewares/verificarToken');

const router = Router();
const validarId = [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo').toInt()];
const validarNombre = (requerido) => body('nombre_cliente')
  [requerido ? 'notEmpty' : 'optional']()
  .trim()
  .notEmpty().withMessage('nombre_cliente es requerido')
  .isLength({ max: 150 }).withMessage('nombre_cliente no puede superar los 150 caracteres');
const validarObservaciones = body('observaciones')
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 2000 }).withMessage('observaciones no puede superar los 2000 caracteres');

router.get('/', verificarToken, ClienteController.obtenerTodas);
router.get('/:id', verificarToken, validarId, ClienteController.obtenerPorId);
router.post('/', verificarToken, [validarNombre(true), validarObservaciones], ClienteController.crear);
router.put('/:id', verificarToken, validarId, [validarNombre(false), validarObservaciones], ClienteController.actualizar);
router.delete('/:id', verificarToken, validarId, ClienteController.eliminar);

module.exports = router;
