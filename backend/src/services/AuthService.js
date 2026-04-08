const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioDAO = require('../daos/UsuarioDAO');

const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '8h';

const mapUsuarioSesion = (usuario) => ({
    id_usuario: usuario.id_usuario,
    nombre_usuario: usuario.nombre_usuario,
    correo_usuario: usuario.correo_usuario,
    rol: usuario.rol,
    id_sucursal: usuario.id_sucursal,
});

const login = async(correo_usuario, contrasena) => {
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

    const payload = {
        id_usuario: usuario.id_usuario,
        id_sucursal: usuario.id_sucursal,
        rol: usuario.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    return {
        token,
        usuario: mapUsuarioSesion(usuario),
    };
};

const obtenerSesionActual = async(id_usuario) => {
    const usuario = await UsuarioDAO.obtenerPorId(id_usuario);

    if (!usuario) {
        const error = new Error('Usuario no encontrado.');
        error.status = 404;
        throw error;
    }

    if (usuario.estado_usuario !== 'activo') {
        const error = new Error('La cuenta está inactiva o suspendida');
        error.status = 403;
        throw error;
    }

    return mapUsuarioSesion(usuario);
};

const logout = () => {
    return { mensaje: 'Sesión cerrada correctamente' };
};

module.exports = { login, obtenerSesionActual, logout };
