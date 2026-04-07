const pool = require('../database/db');

class UsuarioDAO {
    // ─── CREATE ────

    async crear(usuario) {
        const { id_sucursal, nombre_usuario, correo_usuario, contrasena_hash, rol } = usuario;

        const query = `
      INSERT INTO usuario (id_sucursal, nombre_usuario, correo_usuario, contrasena_hash, rol)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const valores = [id_sucursal, nombre_usuario, correo_usuario, contrasena_hash, rol];
        const { rows } = await pool.query(query, valores);
        return rows[0];
    }


    // ─── OBTENER ────

    async obtenerTodos() {
        const query = `SELECT * FROM usuario ORDER BY id_usuario`;
        const { rows } = await pool.query(query);
        return rows;
    }

    async obtenerPorId(id_usuario) {
        const query = `SELECT * FROM usuario WHERE id_usuario = $1`;
        const { rows } = await pool.query(query, [id_usuario]);
        return rows[0] || null;
    }

    async obtenerPorCorreo(correo_usuario) {
        const query = `SELECT * FROM usuario WHERE correo_usuario = $1`;
        const { rows } = await pool.query(query, [correo_usuario]);
        return rows[0] || null;
    }

    async obtenerPorSucursal(id_sucursal) {
        const query = `SELECT * FROM usuario WHERE id_sucursal = $1 ORDER BY id_usuario`;
        const { rows } = await pool.query(query, [id_sucursal]);
        return rows;
    }


    // ─── UPDATE ────

    async actualizar(id_usuario, campos) {
        const { nombre_usuario, correo_usuario, rol, id_sucursal } = campos;

        const query = `
      UPDATE usuario
      SET
        nombre_usuario  = COALESCE($1, nombre_usuario),
        correo_usuario  = COALESCE($2, correo_usuario),
        rol             = COALESCE($3, rol),
        id_sucursal     = COALESCE($4, id_sucursal)
      WHERE id_usuario = $5
      RETURNING *
    `;
        const valores = [nombre_usuario, correo_usuario, rol, id_sucursal, id_usuario];
        const { rows } = await pool.query(query, valores);
        return rows[0] || null;
    }

    async actualizarContrasena(id_usuario, nueva_contrasena_hash) {
        const query = `
      UPDATE usuario
      SET contrasena_hash = $1
      WHERE id_usuario = $2
      RETURNING *
    `;
        const { rows } = await pool.query(query, [nueva_contrasena_hash, id_usuario]);
        return rows[0] || null;
    }

    async cambiarEstado(id_usuario, nuevo_estado) {
        const query = `
      UPDATE usuario
      SET estado_usuario = $1
      WHERE id_usuario = $2
      RETURNING *
    `;
        const { rows } = await pool.query(query, [nuevo_estado, id_usuario]);
        return rows[0] || null;
    }


    // ─── DELETE ────

    async eliminar(id_usuario) {
        const query = `DELETE FROM usuario WHERE id_usuario = $1 RETURNING *`;
        const { rows } = await pool.query(query, [id_usuario]);
        return rows[0] || null;
    }
}

module.exports = new UsuarioDAO();