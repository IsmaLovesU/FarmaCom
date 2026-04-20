const TelefonoSucursalDAO = require('../daos/TelefonoSucursalDAO');
const SucursalDAO = require('../daos/SucursalDAO');

const crearTelefono = async({ id_sucursal, numero }) => {
    const sucursal = await SucursalDAO.obtenerPorId(id_sucursal);
    if (!sucursal) {
        const error = new Error('La sucursal no existe');
        error.status = 404;
        throw error;
    }

    return await TelefonoSucursalDAO.crear({ id_sucursal, numero });
};

const obtenerPorSucursal = async(id_sucursal) => {
    const sucursal = await SucursalDAO.obtenerPorId(id_sucursal);
    if (!sucursal) {
        const error = new Error('La sucursal no existe');
        error.status = 404;
        throw error;
    }

    return await TelefonoSucursalDAO.obtenerPorSucursal(id_sucursal);
};

const obtenerPorId = async(id_telefono_sucursal) => {
    const telefono = await TelefonoSucursalDAO.obtenerPorId(id_telefono_sucursal);
    if (!telefono) {
        const error = new Error('Teléfono no encontrado');
        error.status = 404;
        throw error;
    }

    return telefono;
};

const actualizarTelefono = async(id_telefono_sucursal, { numero }) => {
    const existente = await TelefonoSucursalDAO.obtenerPorId(id_telefono_sucursal);
    if (!existente) {
        const error = new Error('Teléfono no encontrado');
        error.status = 404;
        throw error;
    }

    return await TelefonoSucursalDAO.actualizar(id_telefono_sucursal, { numero });
};

const eliminarTelefono = async(id_telefono_sucursal) => {
    const eliminado = await TelefonoSucursalDAO.eliminar(id_telefono_sucursal);
    if (!eliminado) {
        const error = new Error('Teléfono no encontrado');
        error.status = 404;
        throw error;
    }

    return { mensaje: 'Teléfono eliminado correctamente' };
};

module.exports = {
    crearTelefono,
    obtenerPorSucursal,
    obtenerPorId,
    actualizarTelefono,
    eliminarTelefono,
};