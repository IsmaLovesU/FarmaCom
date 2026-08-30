const { Router } = require('express');
const { query } = require('express-validator');
const ReporteController = require('../controllers/ReporteController');
const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

const router = Router();
const rolesReportes = verificarRol('dueno', 'administrador');

const validarFiltrosReporte = [
  query('id_sucursal')
    .optional()
    .isInt({ min: 1 }).withMessage('id_sucursal debe ser un entero positivo')
    .toInt(),
  query('fecha_desde')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('fecha_desde debe tener formato YYYY-MM-DD')
    .isISO8601({ strict: true }).withMessage('fecha_desde debe ser una fecha válida'),
  query('fecha_hasta')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('fecha_hasta debe tener formato YYYY-MM-DD')
    .isISO8601({ strict: true }).withMessage('fecha_hasta debe ser una fecha válida')
    .custom((fechaHasta, { req }) => (
      !req.query.fecha_desde || fechaHasta >= req.query.fecha_desde
    )).withMessage('fecha_hasta debe ser igual o posterior a fecha_desde'),
];

router.get(
  '/ventas/resumen',
  verificarToken,
  rolesReportes,
  validarFiltrosReporte,
  ReporteController.obtenerResumenVentas,
);

module.exports = router;
