const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioDAO = require('../daos/UsuarioDAO');

const TOKEN_EXPIRY = '8h';
const DEV_LOGIN_EMAIL = process.env.DEV_LOGIN_EMAIL || 'admin@farma.com';
const DEV_LOGIN_PASSWORD = process.env.DEV_LOGIN_PASSWORD || '123456';
const DEV_LOGIN_ENABLED = process.env.NODE_ENV !== 'production';

const buildDevUser = () => ({
    id_usuario: 0,
    nombre_usuario: 'Usuario Temporal',
    correo_usuario: DEV_LOGIN_EMAIL,
    rol: 'administrador',
    id_sucursal: 1,
});

const login = async(correo_usuario, contrasena) => {
    if (
        DEV_LOGIN_ENABLED &&
        correo_usuario === DEV_LOGIN_EMAIL &&
        contrasena === DEV_LOGIN_PASSWORD
    ) {
        const usuario = buildDevUser();
        const payload = {
            id_usuario: usuario.id_usuario,
            id_sucursal: usuario.id_sucursal,
            rol: usuario.rol,
        };

        console.log(`[auth] Acceso temporal de desarrollo para ${correo_usuario}`);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        return { token, usuario };
    }

    const usuario = await UsuarioDAO.obtenerPorCorreo(correo_usuario);
    if (!usuario) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    if (usuario.estado_usuario !== 'activo') {
        const error = new Error('La cuenta está inactiva o suspendida');
        error.status = 403;
        throw error;
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!contrasenaValida) {

        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    // Generar el JWT con info mínima necesaria (payload)
    const payload = {
        id_usuario: usuario.id_usuario,
        id_sucursal: usuario.id_sucursal,
        rol: usuario.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    return {
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            correo_usuario: usuario.correo_usuario,
            rol: usuario.rol,
            id_sucursal: usuario.id_sucursal,
        },
    };
};

const logout = () => {

    return { mensaje: 'Sesión cerrada correctamente' };
};

module.exports = { login, logout };
