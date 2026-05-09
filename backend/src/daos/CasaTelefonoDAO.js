const pool = require('../database/db');

class CasaTelefonoDAO {

  // ─── CREATE ────

  async crear({ id_casa, numero }) {
    const query = `
      INSERT INTO casa_telefono (id_casa, numero)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_casa, numero]);
    return rows[0];
  }

  // ─── OBTENER ────

  async obtenerPorCasa(id_casa) {
    const query = `
      SELECT * FROM casa_telefono
      WHERE id_casa = $1
      ORDER BY id_telefono
    `;
    const { rows } = await pool.query(query, [id_casa]);
    return rows;
  }

  async obtenerPorId(id_telefono) {
    const query = `SELECT * FROM casa_telefono WHERE id_telefono = $1`;
    const { rows } = await pool.query(query, [id_telefono]);
    return rows[0] || null;
  }

  // ─── UPDATE ────

  async actualizar(id_telefono, { numero }) {
    const query = `
      UPDATE casa_telefono
      SET numero = COALESCE($1, numero)
      WHERE id_telefono = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [numero ?? null, id_telefono]);
    return rows[0] || null;
  }

  // ─── DELETE ────

  async eliminar(id_telefono) {
    const query = `DELETE FROM casa_telefono WHERE id_telefono = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_telefono]);
    return rows[0] || null;
  }

  async eliminarPorCasa(id_casa) {
    const query = `DELETE FROM casa_telefono WHERE id_casa = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_casa]);
    return rows;
  }
}

module.exports = new CasaTelefonoDAO();