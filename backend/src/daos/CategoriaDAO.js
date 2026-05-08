const pool = require('../database/db');

class CategoriaDAO {

    // ─── CREATE ────

    async crear({ nombre_categoria, descripcion }) {
        const query = `
      INSERT INTO categoria (nombre_categoria, descripcion)
      VALUES ($1, $2)
      RETURNING *
    `;
        const { rows } = await pool.query(query, [nombre_categoria, descripcion || null]);
        return rows[0];
    }

    // ─── OBTENER ────

    async obtenerTodos() {
        const query = `SELECT * FROM categoria ORDER BY id_categoria`;
        const { rows } = await pool.query(query);
        return rows;
    }

    async obtenerPorId(id_categoria) {
        const query = `SELECT * FROM categoria WHERE id_categoria = $1`;
        const { rows } = await pool.query(query, [id_categoria]);
        return rows[0] || null;
    }

    async obtenerPorNombre(nombre_categoria) {
        const query = `SELECT * FROM categoria WHERE LOWER(nombre_categoria) = LOWER($1)`;
        const { rows } = await pool.query(query, [nombre_categoria]);
        return rows[0] || null;
    }

    // ─── UPDATE ────

    async actualizar(id_categoria, campos) {
        const { nombre_categoria, descripcion } = campos;
        const query = `
      UPDATE categoria
      SET
        nombre_categoria = COALESCE($1, nombre_categoria),
        descripcion      = COALESCE($2, descripcion)
      WHERE id_categoria = $3
      RETURNING *
    `;
        const { rows } = await pool.query(query, [nombre_categoria, descripcion, id_categoria]);
        return rows[0] || null;
    }

    // ─── DELETE ────

    async eliminar(id_categoria) {
        const query = `DELETE FROM categoria WHERE id_categoria = $1 RETURNING *`;
        const { rows } = await pool.query(query, [id_categoria]);
        return rows[0] || null;
    }
}

module.exports = new CategoriaDAO();