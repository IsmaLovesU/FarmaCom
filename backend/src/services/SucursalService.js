const SucursalDAO = require('../daos/SucursalDAO');

const crearSucursal = async ({ id_ciudad, nombre_sucursal, direccion }) => {
  const existente = await SucursalDAO.obtenerPorNombre(nombre_sucursal);
  if (existente) {
    const error = new Error('Ya existe una sucursal con ese nombre');
    error.status = 409;
    throw error;
  }

  return await SucursalDAO.crear({ id_ciudad, nombre_sucursal, direccion });
};

const obtenerTodas = async () => {
  return await SucursalDAO.obtenerTodos();
};

const obtenerPorId = async (id_sucursal) => {
  const sucursal = await SucursalDAO.obtenerPorId(id_sucursal);
  if (!sucursal) {
    const error = new Error('Sucursal no encontrada');
    error.status = 404;
    throw error;
  }
  return sucursal;
};

const actualizarSucursal = async (id_sucursal, campos) => {
  const existente = await SucursalDAO.obtenerPorId(id_sucursal);
  if (!existente) {
    const error = new Error('Sucursal no encontrada');
    error.status = 404;
    throw error;
  }

  if (campos.nombre_sucursal && 
      campos.nombre_sucursal.toLowerCase() !== existente.nombre_sucursal.toLowerCase()) {
    const duplicado = await SucursalDAO.obtenerPorNombre(campos.nombre_sucursal);
    if (duplicado) {
      const error = new Error('Ya existe una sucursal con ese nombre');
      error.status = 409;
      throw error;
    }
  }

  return await SucursalDAO.actualizar(id_sucursal, campos);
};

const eliminarSucursal = async (id_sucursal) => {
  const eliminado = await SucursalDAO.eliminar(id_sucursal);
  if (!eliminado) {
    const error = new Error('Sucursal no encontrada');
    error.status = 404;
    throw error;
  }
  return { mensaje: 'Sucursal eliminada correctamente' };
};

module.exports = {
  crearSucursal,
  obtenerTodas,
  obtenerPorId,
  actualizarSucursal,
  eliminarSucursal,
};