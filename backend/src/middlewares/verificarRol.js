const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        // verificarToken debe ejecutarse antes que este middleware
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autenticado.' });
        }

        const { rol } = req.usuario;

        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({
                mensaje: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}.`,
            });
        }

        next();
    };
};

module.exports = verificarRol;