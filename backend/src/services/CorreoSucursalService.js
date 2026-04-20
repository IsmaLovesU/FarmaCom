const CorreoSucursalDAO = require('../daos/CorreoSucursalDAO');
const SucursalDAO = require('../daos/SucursalDAO');

const crearCorreo = async({ id_sucursal, correo }) => {
    const sucursal = await SucursalDAO.obtenerPorId(id_sucursal);
    if (!sucursal) {
        const error = new Error('La sucursal no existe');
        error.status = 404;
        throw error;
    }

    const duplicado = await CorreoSucursalDAO.obtenerPorCorreo(correo);
    if (duplicado) {
        const error = new Error('Ya existe ese correo registrado en una sucursal');
        error.status = 409;
        throw error;
    }

    return await CorreoSucursalDAO.crear({ id_sucursal, correo });
};

const obtenerPorSucursal = async(id_sucursal) => {
    const sucursal = await SucursalDAO.obtenerPorId(id_sucursal);
    if (!sucursal) {
        const error = new Error('La sucursal no existe');
        error.status = 404;
        throw error;
    }

    return await CorreoSucursalDAO.obtenerPorSucursal(id_sucursal);
};

const obtenerPorId = async(id_correo_sucursal) => {
    const correo = await CorreoSucursalDAO.obtenerPorId(id_correo_sucursal);
    if (!correo) {
        const error = new Error('Correo no encontrado');
        error.status = 404;
        throw error;
    }

    return correo;
};

const actualizarCorreo = async(id_correo_sucursal, { correo }) => {
    const existente = await CorreoSucursalDAO.obtenerPorId(id_correo_sucursal);
    if (!existente) {
        const error = new Error('Correo no encontrado');
        error.status = 404;
        throw error;
    }

    if (correo && correo !== existente.correo) {
        const duplicado = await CorreoSucursalDAO.obtenerPorCorreo(correo);
        if (duplicado) {
            const error = new Error('Ya existe ese correo registrado en una sucursal');
            error.status = 409;
            throw error;
        }
    }

    return await CorreoSucursalDAO.actualizar(id_correo_sucursal, { correo });
};

const eliminarCorreo = async(id_correo_sucursal) => {
    const eliminado = await CorreoSucursalDAO.eliminar(id_correo_sucursal);
    if (!eliminado) {
        const error = new Error('Correo no encontrado');
        error.status = 404;
        throw error;
    }

    return { mensaje: 'Correo eliminado correctamente' };
};

module.exports = {
    crearCorreo,
    obtenerPorSucursal,
    obtenerPorId,
    actualizarCorreo,
    eliminarCorreo,
};