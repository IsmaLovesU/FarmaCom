const { validationResult } = require('express-validator');
const categoriaService = require('../services/CategoriaService');

const crear = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const categoria = await categoriaService.crearCategoria(req.body);
        return res.status(201).json(categoria);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerTodas = async(req, res) => {
    try {
        const categorias = await categoriaService.obtenerTodas();
        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const obtenerPorId = async(req, res) => {
    try {
        const categoria = await categoriaService.obtenerPorId(Number(req.params.id));
        return res.status(200).json(categoria);
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
        const categoria = await categoriaService.actualizarCategoria(
            Number(req.params.id),
            req.body,
        );
        return res.status(200).json(categoria);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const eliminar = async(req, res) => {
    try {
        const resultado = await categoriaService.eliminarCategoria(Number(req.params.id));
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

module.exports = { crear, obtenerTodas, obtenerPorId, actualizar, eliminar };