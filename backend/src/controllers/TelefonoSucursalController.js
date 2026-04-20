const { validationResult } = require('express-validator');
const TelefonoSucursalService = require('../services/TelefonoSucursalService');

const crear = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const id_sucursal = Number(req.params.id_sucursal);
        const { numero } = req.body;
        const telefono = await TelefonoSucursalService.crearTelefono({ id_sucursal, numero });
        return res.status(201).json(telefono);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerPorSucursal = async(req, res) => {
    try {
        const id_sucursal = Number(req.params.id_sucursal);
        const telefonos = await TelefonoSucursalService.obtenerPorSucursal(id_sucursal);
        return res.status(200).json(telefonos);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerPorId = async(req, res) => {
    try {
        const telefono = await TelefonoSucursalService.obtenerPorId(Number(req.params.id));
        return res.status(200).json(telefono);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const actualizar = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const telefono = await TelefonoSucursalService.actualizarTelefono(
            Number(req.params.id),
            req.body,
        );
        return res.status(200).json(telefono);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const eliminar = async(req, res) => {
    try {
        const resultado = await TelefonoSucursalService.eliminarTelefono(Number(req.params.id));
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

module.exports = { crear, obtenerPorSucursal, obtenerPorId, actualizar, eliminar };