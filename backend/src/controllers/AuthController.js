const { validationResult } = require('express-validator');
const authService = require('../services/AuthService');

const COOKIE_NAME = 'auth_token';

const login = async(req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { correo_usuario, contrasena } = req.body;
        const { token, usuario } = await authService.login(correo_usuario, contrasena);

        // Guardar el JWT en una cookie httpOnly 
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000,
        });

        return res.status(200).json({ usuario });
    } catch (error) {
        return res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie(COOKIE_NAME);
    return res.status(200).json(authService.logout());
};

module.exports = { login, logout };