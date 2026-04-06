const { Router } = require('express');
const { body } = require('express-validator');
const UsuarioController = require('../controllers/UsuarioController');

const router = Router();

// Validaciones reutilizables
const validarCreacion = [
    body('id_sucursal').isInt({ min: 1 }).withMessage('id_sucursal debe ser un entero positivo'),
    body('nombre_usuario').notEmpty().withMessage('nombre_usuario es requerido'),
    body('correo_usuario').isEmail().withMessage('correo_usuario no es válido'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').isIn(['dueno', 'administrador', 'dependiente']).withMessage('Rol no válido'),
];

const validarActualizacion = [
    body('correo_usuario').optional().isEmail().withMessage('correo_usuario no es válido'),
    body('rol').optional().isIn(['dueno', 'administrador', 'dependiente']).withMessage('Rol no válido'),
    body('id_sucursal').optional().isInt({ min: 1 }).withMessage('id_sucursal debe ser un entero positivo'),
];

const validarCambioContrasena = [
    body('contrasena_actual').notEmpty().withMessage('contrasena_actual es requerida'),
    body('contrasena_nueva').isLength({ min: 6 }).withMessage('La contraseña nueva debe tener al menos 6 caracteres'),
];

const validarCambioEstado = [
    body('estado').isIn(['activo', 'inactivo', 'suspendido']).withMessage('Estado no válido'),
];

// ─── Rutas ────

// GET    /api/usuarios
router.get('/', UsuarioController.obtenerTodos);

// GET    /api/usuarios/:id
router.get('/:id', UsuarioController.obtenerPorId);

// GET    /api/usuarios/sucursal/:id_sucursal
router.get('/sucursal/:id_sucursal', UsuarioController.obtenerPorSucursal);

// POST   /api/usuarios
router.post('/', validarCreacion, UsuarioController.crear);

// PUT    /api/usuarios/:id
router.put('/:id', validarActualizacion, UsuarioController.actualizar);

// PATCH  /api/usuarios/:id/contrasena
router.patch('/:id/contrasena', validarCambioContrasena, UsuarioController.cambiarContrasena);

// PATCH  /api/usuarios/:id/estado
router.patch('/:id/estado', validarCambioEstado, UsuarioController.cambiarEstado);

// DELETE /api/usuarios/:id
router.delete('/:id', UsuarioController.eliminar);

module.exports = router;