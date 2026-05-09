const pool = require('../database/db');

class ProveedorDAO {

  // ─── CREATE ────

  async crear({ nombre }) {
    const query = `
      INSERT INTO proveedor (nombre)
      VALUES ($1)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre]);
    return rows[0];
  }

  // ─── OBTENER ────

  async obtenerTodos() {
    const query = `SELECT * FROM proveedor ORDER BY id_proveedor`;
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id_proveedor) {
    const query = `SELECT * FROM proveedor WHERE id_proveedor = $1`;
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows[0] || null;
  }

  async obtenerPorNombre(nombre) {
    const query = `SELECT * FROM proveedor WHERE LOWER(nombre) = LOWER($1)`;
    const { rows } = await pool.query(query, [nombre]);
    return rows[0] || null;
  }

  // ─── UPDATE ────

  async actualizar(id_proveedor, { nombre }) {
    const query = `
      UPDATE proveedor
      SET nombre = COALESCE($1, nombre)
      WHERE id_proveedor = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre ?? null, id_proveedor]);
    return rows[0] || null;
  }

  async cambiarActivo(id_proveedor, activo) {
    const query = `
      UPDATE proveedor
      SET activo = $1
      WHERE id_proveedor = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [activo, id_proveedor]);
    return rows[0] || null;
  }

  // ─── DELETE ────

  async eliminar(id_proveedor) {
    const query = `DELETE FROM proveedor WHERE id_proveedor = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows[0] || null;
  }
}

module.exports = new ProveedorDAO();