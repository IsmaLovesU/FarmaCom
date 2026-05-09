const ProveedorEmailDAO = require('../daos/ProveedorEmailDAO');
const ProveedorDAO = require('../daos/ProveedorDAO');

const crearEmail = async ({ id_proveedor, correo }) => {
  const proveedor = await ProveedorDAO.obtenerPorId(id_proveedor);
  if (!proveedor) {
    const error = new Error('El proveedor no existe');
    error.status = 404;
    throw error;
  }

  const duplicado = await ProveedorEmailDAO.obtenerPorCorreo(correo);
  if (duplicado) {
    const error = new Error('Ya existe ese correo registrado en un proveedor');
    error.status = 409;
    throw error;
  }

  return await ProveedorEmailDAO.crear({ id_proveedor, correo });
};

const obtenerPorProveedor = async (id_proveedor) => {
  const proveedor = await ProveedorDAO.obtenerPorId(id_proveedor);
  if (!proveedor) {
    const error = new Error('El proveedor no existe');
    error.status = 404;
    throw error;
  }

  return await ProveedorEmailDAO.obtenerPorProveedor(id_proveedor);
};

const obtenerPorId = async (id_email) => {
  const email = await ProveedorEmailDAO.obtenerPorId(id_email);
  if (!email) {
    const error = new Error('Correo no encontrado');
    error.status = 404;
    throw error;
  }
  return email;
};

const actualizarEmail = async (id_email, { correo }) => {
  const existente = await ProveedorEmailDAO.obtenerPorId(id_email);
  if (!existente) {
    const error = new Error('Correo no encontrado');
    error.status = 404;
    throw error;
  }

  if (correo && correo !== existente.correo) {
    const duplicado = await ProveedorEmailDAO.obtenerPorCorreo(correo);
    if (duplicado) {
      const error = new Error('Ya existe ese correo registrado en un proveedor');
      error.status = 409;
      throw error;
    }
  }

  return await ProveedorEmailDAO.actualizar(id_email, { correo });
};

const eliminarEmail = async (id_email) => {
  const eliminado = await ProveedorEmailDAO.eliminar(id_email);
  if (!eliminado) {
    const error = new Error('Correo no encontrado');
    error.status = 404;
    throw error;
  }
  return { mensaje: 'Correo eliminado correctamente' };
};

module.exports = {
  crearEmail,
  obtenerPorProveedor,
  obtenerPorId,
  actualizarEmail,
  eliminarEmail,
};