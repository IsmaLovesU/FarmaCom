const { validationResult } = require('express-validator');
const authService = require('../services/AuthService');
const {
    COOKIE_NAME,
    buildAuthCookieOptions,
    buildAuthCookieClearOptions,
} = require('../config/auth');

const login = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { correo_usuario, contrasena } = req.body;
        const { token, usuario } = await authService.login(correo_usuario, contrasena);

        // Guardar el JWT en una cookie httpOnly con la misma expiracion que el token.
        res.cookie(COOKIE_NAME, token, buildAuthCookieOptions());

        return res.status(200).json({ usuario });
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const logout = async(req, res) => {
    const resultado = await authService.logout(req.cookies[COOKIE_NAME]);
    res.clearCookie(COOKIE_NAME, buildAuthCookieClearOptions());
    return res.status(200).json(resultado);
};

const me = async(req, res) => {
    try {
        const usuario = await authService.obtenerSesionActual(req.usuario.id_usuario);
        return res.status(200).json({ usuario });
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

module.exports = { login, logout, me };
