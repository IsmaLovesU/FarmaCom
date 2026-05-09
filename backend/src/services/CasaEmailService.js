const CasaEmailDAO = require('../daos/CasaEmailDAO');
const CasaFarmaceuticaDAO = require('../daos/CasaFarmaceuticaDAO');

const crearEmail = async ({ id_casa, correo }) => {
  const casa = await CasaFarmaceuticaDAO.obtenerPorId(id_casa);
  if (!casa) {
    const error = new Error('La casa farmacéutica no existe');
    error.status = 404;
    throw error;
  }

  const duplicado = await CasaEmailDAO.obtenerPorCorreo(correo);
  if (duplicado) {
    const error = new Error('Ya existe ese correo registrado en una casa farmacéutica');
    error.status = 409;
    throw error;
  }

  return await CasaEmailDAO.crear({ id_casa, correo });
};

const obtenerPorCasa = async (id_casa) => {
  const casa = await CasaFarmaceuticaDAO.obtenerPorId(id_casa);
  if (!casa) {
    const error = new Error('La casa farmacéutica no existe');
    error.status = 404;
    throw error;
  }

  return await CasaEmailDAO.obtenerPorCasa(id_casa);
};

const obtenerPorId = async (id_email) => {
  const email = await CasaEmailDAO.obtenerPorId(id_email);
  if (!email) {
    const error = new Error('Correo no encontrado');
    error.status = 404;
    throw error;
  }
  return email;
};

const actualizarEmail = async (id_email, { correo }) => {
  const existente = await CasaEmailDAO.obtenerPorId(id_email);
  if (!existente) {
    const error = new Error('Correo no encontrado');
    error.status = 404;
    throw error;
  }

  if (correo && correo !== existente.correo) {
    const duplicado = await CasaEmailDAO.obtenerPorCorreo(correo);
    if (duplicado) {
      const error = new Error('Ya existe ese correo registrado en una casa farmacéutica');
      error.status = 409;
      throw error;
    }
  }

  return await CasaEmailDAO.actualizar(id_email, { correo });
};

const eliminarEmail = async (id_email) => {
  const eliminado = await CasaEmailDAO.eliminar(id_email);
  if (!eliminado) {
    const error = new Error('Correo no encontrado');
    error.status = 404;
    throw error;
  }
  return { mensaje: 'Correo eliminado correctamente' };
};

module.exports = {
  crearEmail,
  obtenerPorCasa,
  obtenerPorId,
  actualizarEmail,
  eliminarEmail,
};