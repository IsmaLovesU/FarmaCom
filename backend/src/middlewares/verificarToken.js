const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Inicia sesión primero.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload; // { id_usuario, id_sucursal, rol }
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};

module.exports = verificarToken;