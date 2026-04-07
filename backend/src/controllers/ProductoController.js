const ProductoService = require('../services/ProductoService');

const obtenerProductos = (req, res) => {
  const productos = ProductoService.obtenerProductos();
  res.json({
    success: true,
    data: productos,
    total: productos.length,
  });
};

module.exports = { obtenerProductos };