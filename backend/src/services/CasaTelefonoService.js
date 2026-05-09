const CasaTelefonoDAO = require('../daos/CasaTelefonoDAO');
const CasaFarmaceuticaDAO = require('../daos/CasaFarmaceuticaDAO');

const crearTelefono = async ({ id_casa, numero }) => {
  const casa = await CasaFarmaceuticaDAO.obtenerPorId(id_casa);
  if (!casa) {
    const error = new Error('La casa farmacéutica no existe');
    error.status = 404;
    throw error;
  }

  return await CasaTelefonoDAO.crear({ id_casa, numero });
};

const obtenerPorCasa = async (id_casa) => {
  const casa = await CasaFarmaceuticaDAO.obtenerPorId(id_casa);
  if (!casa) {
    const error = new Error('La casa farmacéutica no existe');
    error.status = 404;
    throw error;
  }

  return await CasaTelefonoDAO.obtenerPorCasa(id_casa);
};

const obtenerPorId = async (id_telefono) => {
  const telefono = await CasaTelefonoDAO.obtenerPorId(id_telefono);
  if (!telefono) {
    const error = new Error('Teléfono no encontrado');
    error.status = 404;
    throw error;
  }
  return telefono;
};

const actualizarTelefono = async (id_telefono, { numero }) => {
  const existente = await CasaTelefonoDAO.obtenerPorId(id_telefono);
  if (!existente) {
    const error = new Error('Teléfono no encontrado');
    error.status = 404;
    throw error;
  }

  return await CasaTelefonoDAO.actualizar(id_telefono, { numero });
};

const eliminarTelefono = async (id_telefono) => {
  const eliminado = await CasaTelefonoDAO.eliminar(id_telefono);
  if (!eliminado) {
    const error = new Error('Teléfono no encontrado');
    error.status = 404;
    throw error;
  }
  return { mensaje: 'Teléfono eliminado correctamente' };
};

module.exports = {
  crearTelefono,
  obtenerPorCasa,
  obtenerPorId,
  actualizarTelefono,
  eliminarTelefono,
};