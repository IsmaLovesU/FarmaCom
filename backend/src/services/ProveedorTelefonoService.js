const ProveedorTelefonoDAO = require('../daos/ProveedorTelefonoDAO');
const ProveedorDAO = require('../daos/ProveedorDAO');

const crearTelefono = async ({ id_proveedor, numero }) => {
  const proveedor = await ProveedorDAO.obtenerPorId(id_proveedor);
  if (!proveedor) {
    const error = new Error('El proveedor no existe');
    error.status = 404;
    throw error;
  }

  return await ProveedorTelefonoDAO.crear({ id_proveedor, numero });
};

const obtenerPorProveedor = async (id_proveedor) => {
  const proveedor = await ProveedorDAO.obtenerPorId(id_proveedor);
  if (!proveedor) {
    const error = new Error('El proveedor no existe');
    error.status = 404;
    throw error;
  }

  return await ProveedorTelefonoDAO.obtenerPorProveedor(id_proveedor);
};

const obtenerPorId = async (id_telefono) => {
  const telefono = await ProveedorTelefonoDAO.obtenerPorId(id_telefono);
  if (!telefono) {
    const error = new Error('Teléfono no encontrado');
    error.status = 404;
    throw error;
  }
  return telefono;
};

const actualizarTelefono = async (id_telefono, { numero }) => {
  const existente = await ProveedorTelefonoDAO.obtenerPorId(id_telefono);
  if (!existente) {
    const error = new Error('Teléfono no encontrado');
    error.status = 404;
    throw error;
  }

  return await ProveedorTelefonoDAO.actualizar(id_telefono, { numero });
};

const eliminarTelefono = async (id_telefono) => {
  const eliminado = await ProveedorTelefonoDAO.eliminar(id_telefono);
  if (!eliminado) {
    const error = new Error('Teléfono no encontrado');
    error.status = 404;
    throw error;
  }
  return { mensaje: 'Teléfono eliminado correctamente' };
};

module.exports = {
  crearTelefono,
  obtenerPorProveedor,
  obtenerPorId,
  actualizarTelefono,
  eliminarTelefono,
};