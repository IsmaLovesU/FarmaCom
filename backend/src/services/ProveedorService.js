const ProveedorDAO = require('../daos/ProveedorDAO');

const crearProveedor = async ({ nombre }) => {
  const existente = await ProveedorDAO.obtenerPorNombre(nombre);
  if (existente) {
    const error = new Error('Ya existe un proveedor con ese nombre');
    error.status = 409;
    throw error;
  }

  return await ProveedorDAO.crear({ nombre });
};

const obtenerTodos = async () => {
  return await ProveedorDAO.obtenerTodos();
};

const obtenerPorId = async (id_proveedor) => {
  const proveedor = await ProveedorDAO.obtenerPorId(id_proveedor);
  if (!proveedor) {
    const error = new Error('Proveedor no encontrado');
    error.status = 404;
    throw error;
  }
  return proveedor;
};

const actualizarProveedor = async (id_proveedor, campos) => {
  const existente = await ProveedorDAO.obtenerPorId(id_proveedor);
  if (!existente) {
    const error = new Error('Proveedor no encontrado');
    error.status = 404;
    throw error;
  }

  if (campos.nombre && campos.nombre.toLowerCase() !== existente.nombre.toLowerCase()) {
    const duplicado = await ProveedorDAO.obtenerPorNombre(campos.nombre);
    if (duplicado) {
      const error = new Error('Ya existe un proveedor con ese nombre');
      error.status = 409;
      throw error;
    }
  }

  return await ProveedorDAO.actualizar(id_proveedor, campos);
};

const cambiarEstado = async (id_proveedor, activo) => {
  const existente = await ProveedorDAO.obtenerPorId(id_proveedor);
  if (!existente) {
    const error = new Error('Proveedor no encontrado');
    error.status = 404;
    throw error;
  }

  return await ProveedorDAO.cambiarActivo(id_proveedor, activo);
};

const eliminarProveedor = async (id_proveedor) => {
  const eliminado = await ProveedorDAO.eliminar(id_proveedor);
  if (!eliminado) {
    const error = new Error('Proveedor no encontrado');
    error.status = 404;
    throw error;
  }
  return { mensaje: 'Proveedor eliminado correctamente' };
};

module.exports = {
  crearProveedor,
  obtenerTodos,
  obtenerPorId,
  actualizarProveedor,
  cambiarEstado,
  eliminarProveedor,
};