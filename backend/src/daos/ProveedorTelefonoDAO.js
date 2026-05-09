const pool = require('../database/db');

class ProveedorTelefonoDAO {

  // ─── CREATE ────

  async crear({ id_proveedor, numero }) {
    const query = `
      INSERT INTO proveedor_telefono (id_proveedor, numero)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_proveedor, numero]);
    return rows[0];
  }

  // ─── OBTENER ────

  async obtenerPorProveedor(id_proveedor) {
    const query = `
      SELECT * FROM proveedor_telefono
      WHERE id_proveedor = $1
      ORDER BY id_telefono
    `;
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  }

  async obtenerPorId(id_telefono) {
    const query = `SELECT * FROM proveedor_telefono WHERE id_telefono = $1`;
    const { rows } = await pool.query(query, [id_telefono]);
    return rows[0] || null;
  }

  // ─── UPDATE ────

  async actualizar(id_telefono, { numero }) {
    const query = `
      UPDATE proveedor_telefono
      SET numero = COALESCE($1, numero)
      WHERE id_telefono = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [numero ?? null, id_telefono]);
    return rows[0] || null;
  }

  // ─── DELETE ────

  async eliminar(id_telefono) {
    const query = `DELETE FROM proveedor_telefono WHERE id_telefono = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_telefono]);
    return rows[0] || null;
  }

  async eliminarPorProveedor(id_proveedor) {
    const query = `DELETE FROM proveedor_telefono WHERE id_proveedor = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  }
}

module.exports = new ProveedorTelefonoDAO();