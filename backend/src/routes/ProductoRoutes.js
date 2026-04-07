const express = require('express');
const router = express.Router();
const { obtenerProductos } = require('../controllers/ProductoController');

// GET /api/productos
router.get('/', obtenerProductos);

module.exports = router;