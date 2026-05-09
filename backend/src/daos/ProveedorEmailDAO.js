const pool = require('../database/db');

class ProveedorEmailDAO {

  // ─── CREATE ────

  async crear({ id_proveedor, correo }) {
    const query = `
      INSERT INTO proveedor_email (id_proveedor, correo)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_proveedor, correo]);
    return rows[0];
  }

  // ─── OBTENER ────

  async obtenerPorProveedor(id_proveedor) {
    const query = `
      SELECT * FROM proveedor_email
      WHERE id_proveedor = $1
      ORDER BY id_email
    `;
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  }

  async obtenerPorId(id_email) {
    const query = `SELECT * FROM proveedor_email WHERE id_email = $1`;
    const { rows } = await pool.query(query, [id_email]);
    return rows[0] || null;
  }

  async obtenerPorCorreo(correo) {
    const query = `SELECT * FROM proveedor_email WHERE correo = $1`;
    const { rows } = await pool.query(query, [correo]);
    return rows[0] || null;
  }

  // ─── UPDATE ────

  async actualizar(id_email, { correo }) {
    const query = `
      UPDATE proveedor_email
      SET correo = COALESCE($1, correo)
      WHERE id_email = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [correo ?? null, id_email]);
    return rows[0] || null;
  }

  // ─── DELETE ────

  async eliminar(id_email) {
    const query = `DELETE FROM proveedor_email WHERE id_email = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_email]);
    return rows[0] || null;
  }

  async eliminarPorProveedor(id_proveedor) {
    const query = `DELETE FROM proveedor_email WHERE id_proveedor = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  }
}

module.exports = new ProveedorEmailDAO();