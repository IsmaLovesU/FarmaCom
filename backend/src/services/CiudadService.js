const CiudadDAO = require('../daos/CiudadDAO');

const crearCiudad = async ({ nombre_ciudad }) => {
  const existente = await CiudadDAO.obtenerPorNombre(nombre_ciudad);
  if (existente) {
    const error = new Error('Ya existe una ciudad con ese nombre');
    error.status = 409;
    throw error;
  }

  return CiudadDAO.crear({ nombre_ciudad });
};

const obtenerTodas = async () => {
  return CiudadDAO.obtenerTodas();
};

const obtenerPorId = async (id_ciudad) => {
  const ciudad = await CiudadDAO.obtenerPorId(id_ciudad);
  if (!ciudad) {
    const error = new Error('Ciudad no encontrada');
    error.status = 404;
    throw error;
  }
  return ciudad;
};

const actualizarCiudad = async (id_ciudad, campos) => {
  const existente = await CiudadDAO.obtenerPorId(id_ciudad);
  if (!existente) {
    const error = new Error('Ciudad no encontrada');
    error.status = 404;
    throw error;
  }

  if (
    campos.nombre_ciudad &&
    campos.nombre_ciudad.toLowerCase() !== existente.nombre_ciudad.toLowerCase()
  ) {
    const duplicado = await CiudadDAO.obtenerPorNombre(campos.nombre_ciudad);
    if (duplicado) {
      const error = new Error('Ya existe una ciudad con ese nombre');
      error.status = 409;
      throw error;
    }
  }

  return CiudadDAO.actualizar(id_ciudad, campos);
};

const eliminarCiudad = async (id_ciudad) => {
  try {
    const eliminado = await CiudadDAO.eliminar(id_ciudad);
    if (!eliminado) {
      const error = new Error('Ciudad no encontrada');
      error.status = 404;
      throw error;
    }
    return { mensaje: 'Ciudad eliminada correctamente' };
  } catch (error) {
    if (error.code === '23503') {
      const conflicto = new Error('No se puede eliminar una ciudad asociada a sucursales');
      conflicto.status = 409;
      throw conflicto;
    }
    throw error;
  }
};

module.exports = {
  crearCiudad,
  obtenerTodas,
  obtenerPorId,
  actualizarCiudad,
  eliminarCiudad,
};
