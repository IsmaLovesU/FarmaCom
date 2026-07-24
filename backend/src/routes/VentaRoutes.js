const { Router } = require('express');
const { body, param } = require('express-validator');
const VentaController = require('../controllers/VentaController');
const verificarToken = require('../middlewares/verificarToken');

const router = Router();

const validarId = [
  param('id')
    .isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
    .toInt(),
];

const validarObservaciones = body('observaciones')
  .optional({ nullable: true })
  .isString().withMessage('observaciones debe ser texto')
  .trim()
  .isLength({ max: 2000 })
  .withMessage('observaciones no puede superar los 2000 caracteres');

const validarDetalles = body('detalles')
  .isArray({ min: 1 })
  .withMessage('detalles debe contener al menos un artículo');

const crearValidacionesDetalle = ({ soloSiHayDetalles = false } = {}) => {
  const descripcion = body('detalles.*.descripcion')
    .trim()
    .notEmpty().withMessage('La descripción del artículo es requerida')
    .isLength({ max: 200 })
    .withMessage('La descripción no puede superar los 200 caracteres');
  const cantidad = body('detalles.*.cantidad')
    .isFloat({ gt: 0 }).withMessage('La cantidad debe ser mayor a 0')
    .toFloat();
  const precioUnitario = body('detalles.*.precio_unitario')
    .isFloat({ min: 0 }).withMessage('El precio unitario no puede ser negativo')
    .toFloat();

  if (soloSiHayDetalles) {
    const hayDetalles = (_valor, { req }) => Array.isArray(req.body.detalles);
    descripcion.if(hayDetalles);
    cantidad.if(hayDetalles);
    precioUnitario.if(hayDetalles);
  }

  return [descripcion, cantidad, precioUnitario];
};

const validarCreacion = [
  validarObservaciones,
  validarDetalles,
  ...crearValidacionesDetalle(),
];

const validarActualizacion = [
  body().custom((value) => {
    const camposPermitidos = ['observaciones', 'detalles'];
    const tieneCampo = camposPermitidos.some((campo) =>
      Object.prototype.hasOwnProperty.call(value, campo));

    if (!tieneCampo) {
      throw new Error('Debes enviar observaciones o detalles');
    }
    return true;
  }),
  validarObservaciones,
  body('detalles')
    .optional()
    .isArray({ min: 1 })
    .withMessage('detalles debe contener al menos un artículo'),
  ...crearValidacionesDetalle({ soloSiHayDetalles: true }),
];

router.get('/', verificarToken, VentaController.obtenerTodas);
router.get('/:id', verificarToken, validarId, VentaController.obtenerPorId);
router.post('/', verificarToken, validarCreacion, VentaController.crear);
router.put(
  '/:id',
  verificarToken,
  validarId,
  validarActualizacion,
  VentaController.actualizar,
);
router.delete('/:id', verificarToken, validarId, VentaController.eliminar);

module.exports = router;
