const pool = require('../database/db');

class CategoriaDAO {

    // ─── CREATE ────

    async crear({ nombre }) {
        const query = `
      INSERT INTO categoria (nombre)
      VALUES ($1)
      RETURNING *
    `;
        const { rows } = await pool.query(query, [nombre]);
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

    async obtenerPorNombre(nombre) {
        const query = `SELECT * FROM categoria WHERE LOWER(nombre) = LOWER($1)`;
        const { rows } = await pool.query(query, [nombre]);
        return rows[0] || null;
    }

    // ─── UPDATE ────

    async actualizar(id_categoria, campos) {
        const { nombre } = campos;
        const query = `
      UPDATE categoria
      SET nombre = COALESCE($1, nombre)
      WHERE id_categoria = $2
      RETURNING *
    `;
        const { rows } = await pool.query(query, [nombre, id_categoria]);
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