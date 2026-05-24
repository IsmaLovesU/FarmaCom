const InventarioService = require('../services/InventarioService');

/**
 * GET /api/sucursales/:id_sucursal/inventario
 * Lista todos los productos con stock agregado en la sucursal.
 */
const obtenerInventario = async (req, res) => {
  try {
    const productos = await InventarioService.obtenerInventarioPorSucursal(
      Number(req.params.id_sucursal),
    );
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

/**
 * GET /api/sucursales/:id_sucursal/inventario/resumen
 * Devuelve los conteos para las tarjetas del dashboard de inventario.
 */
const obtenerResumen = async (req, res) => {
  try {
    const resumen = await InventarioService.obtenerResumenPorSucursal(
      Number(req.params.id_sucursal),
    );
    return res.status(200).json(resumen);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { obtenerInventario, obtenerResumen };