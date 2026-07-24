const VentaDAO = require('../daos/VentaDAO');

const lanzarError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  throw error;
};

const validarSesion = (usuario) => {
  if (!usuario?.id_usuario || !usuario?.id_sucursal) {
    lanzarError('No se pudo determinar el usuario o la sucursal de la venta', 401);
  }
};

const crearVenta = async (datos, usuario) => {
  validarSesion(usuario);

  return await VentaDAO.crear({
    id_sucursal: usuario.id_sucursal,
    id_usuario: usuario.id_usuario,
    observaciones: datos.observaciones,
    detalles: datos.detalles,
  });
};

const obtenerTodas = async (usuario) => {
  validarSesion(usuario);
  return await VentaDAO.obtenerTodas(usuario.id_sucursal);
};

const obtenerPorId = async (id_venta, usuario) => {
  validarSesion(usuario);

  const venta = await VentaDAO.obtenerPorId(id_venta, usuario.id_sucursal);
  if (!venta) lanzarError('Venta no encontrada', 404);
  return venta;
};

const actualizarVenta = async (id_venta, campos, usuario) => {
  const existente = await obtenerPorId(id_venta, usuario);
  if (existente.estado !== 'borrador') {
    lanzarError('Solo se pueden editar ventas en estado borrador', 409);
  }

  const actualizada = await VentaDAO.actualizar(
    id_venta,
    usuario.id_sucursal,
    campos,
  );
  if (!actualizada) lanzarError('Venta no encontrada', 404);
  return actualizada;
};

const eliminarVenta = async (id_venta, usuario) => {
  const existente = await obtenerPorId(id_venta, usuario);
  if (existente.estado !== 'borrador') {
    lanzarError('Solo se pueden eliminar ventas en estado borrador', 409);
  }

  const eliminada = await VentaDAO.eliminar(id_venta, usuario.id_sucursal);
  if (!eliminada) lanzarError('No se pudo eliminar la venta', 409);
  return { mensaje: 'Venta eliminada correctamente' };
};

module.exports = {
  crearVenta,
  obtenerTodas,
  obtenerPorId,
  actualizarVenta,
  eliminarVenta,
};
