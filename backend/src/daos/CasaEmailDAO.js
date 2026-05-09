const pool = require('../database/db');

class CasaEmailDAO {

  // ─── CREATE ────

  async crear({ id_casa, correo }) {
    const query = `
      INSERT INTO casa_email (id_casa, correo)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_casa, correo]);
    return rows[0];
  }

  // ─── OBTENER ────

  async obtenerPorCasa(id_casa) {
    const query = `
      SELECT * FROM casa_email
      WHERE id_casa = $1
      ORDER BY id_email
    `;
    const { rows } = await pool.query(query, [id_casa]);
    return rows;
  }

  async obtenerPorId(id_email) {
    const query = `SELECT * FROM casa_email WHERE id_email = $1`;
    const { rows } = await pool.query(query, [id_email]);
    return rows[0] || null;
  }

  async obtenerPorCorreo(correo) {
    const query = `SELECT * FROM casa_email WHERE correo = $1`;
    const { rows } = await pool.query(query, [correo]);
    return rows[0] || null;
  }

  // ─── UPDATE ────

  async actualizar(id_email, { correo }) {
    const query = `
      UPDATE casa_email
      SET correo = COALESCE($1, correo)
      WHERE id_email = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [correo ?? null, id_email]);
    return rows[0] || null;
  }

  // ─── DELETE ────

  async eliminar(id_email) {
    const query = `DELETE FROM casa_email WHERE id_email = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_email]);
    return rows[0] || null;
  }

  async eliminarPorCasa(id_casa) {
    const query = `DELETE FROM casa_email WHERE id_casa = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_casa]);
    return rows;
  }
}

module.exports = new CasaEmailDAO();