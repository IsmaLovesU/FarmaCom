const { validationResult } = require('express-validator');
const usuarioService = require('../services/UsuarioService');

const crear = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const usuario = await usuarioService.crearUsuario(req.body);
        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerTodos = async(req, res) => {
    try {
        const usuarios = await usuarioService.obtenerTodos();
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerPorId = async(req, res) => {
    try {
        const usuario = await usuarioService.obtenerPorId(Number(req.params.id));
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerPorSucursal = async(req, res) => {
    try {
        const usuarios = await usuarioService.obtenerPorSucursal(Number(req.params.id_sucursal));
        return res.status(200).json(usuarios);
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
        const usuario = await usuarioService.actualizarUsuario(Number(req.params.id), req.body);
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const cambiarContrasena = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { contrasena_actual, contrasena_nueva } = req.body;
        const resultado = await usuarioService.cambiarContrasena(Number(req.params.id), contrasena_actual, contrasena_nueva);
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const cambiarEstado = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { estado } = req.body;
        const usuario = await usuarioService.cambiarEstado(Number(req.params.id), estado);
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const eliminar = async(req, res) => {
    try {
        const resultado = await usuarioService.eliminarUsuario(Number(req.params.id));
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

module.exports = {
    crear,
    obtenerTodos,
    obtenerPorId,
    obtenerPorSucursal,
    actualizar,
    cambiarContrasena,
    cambiarEstado,
    eliminar,
};