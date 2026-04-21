const { validationResult } = require('express-validator');
const CorreoSucursalService = require('../services/CorreoSucursalService');

const crear = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const id_sucursal = Number(req.params.id_sucursal);
        const { correo } = req.body;
        const correoCreado = await CorreoSucursalService.crearCorreo({ id_sucursal, correo });
        return res.status(201).json(correoCreado);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerPorSucursal = async(req, res) => {
    try {
        const id_sucursal = Number(req.params.id_sucursal);
        const correos = await CorreoSucursalService.obtenerPorSucursal(id_sucursal);
        return res.status(200).json(correos);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerPorId = async(req, res) => {
    try {
        const correo = await CorreoSucursalService.obtenerPorId(Number(req.params.id));
        return res.status(200).json(correo);
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
        const correo = await CorreoSucursalService.actualizarCorreo(
            Number(req.params.id),
            req.body,
        );
        return res.status(200).json(correo);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const eliminar = async(req, res) => {
    try {
        const resultado = await CorreoSucursalService.eliminarCorreo(Number(req.params.id));
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

module.exports = { crear, obtenerPorSucursal, obtenerPorId, actualizar, eliminar };