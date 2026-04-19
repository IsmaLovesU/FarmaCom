const pool = require('../database/db');

class CorreoSucursalDAO {

  // ─── CREATE ────

  async crear({ id_sucursal, correo }) {
    const query = `
      INSERT INTO correo_sucursal (id_sucursal, correo)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_sucursal, correo]);
    return rows[0];
  }

  // ─── OBTENER ────

  async obtenerTodos() {
    const query = `SELECT * FROM correo_sucursal ORDER BY id_correo_sucursal`;
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id_correo_sucursal) {
    const query = `SELECT * FROM correo_sucursal WHERE id_correo_sucursal = $1`;
    const { rows } = await pool.query(query, [id_correo_sucursal]);
    return rows[0] || null;
  }

  async obtenerPorSucursal(id_sucursal) {
    const query = `
      SELECT * FROM correo_sucursal
      WHERE id_sucursal = $1
      ORDER BY id_correo_sucursal
    `;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows;
  }

  async obtenerPorCorreo(correo) {
    const query = `SELECT * FROM correo_sucursal WHERE correo = $1`;
    const { rows } = await pool.query(query, [correo]);
    return rows[0] || null;
  }

  // ─── UPDATE ────

  async actualizar(id_correo_sucursal, { correo }) {
    const query = `
      UPDATE correo_sucursal
      SET correo = COALESCE($1, correo)
      WHERE id_correo_sucursal = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [correo, id_correo_sucursal]);
    return rows[0] || null;
  }

  // ─── DELETE ────

  async eliminar(id_correo_sucursal) {
    const query = `
      DELETE FROM correo_sucursal
      WHERE id_correo_sucursal = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_correo_sucursal]);
    return rows[0] || null;
  }

  async eliminarPorSucursal(id_sucursal) {
    const query = `
      DELETE FROM correo_sucursal
      WHERE id_sucursal = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows;
  }
}

module.exports = new CorreoSucursalDAO();