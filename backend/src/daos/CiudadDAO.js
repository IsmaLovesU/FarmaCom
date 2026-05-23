const pool = require('../database/db');

class CiudadDAO {
  async crear({ nombre_ciudad }) {
    const query = `
      INSERT INTO ciudad (nombre_ciudad)
      VALUES ($1)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre_ciudad]);
    return rows[0];
  }

  async obtenerTodas() {
    const query = 'SELECT * FROM ciudad ORDER BY nombre_ciudad';
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id_ciudad) {
    const query = 'SELECT * FROM ciudad WHERE id_ciudad = $1';
    const { rows } = await pool.query(query, [id_ciudad]);
    return rows[0] || null;
  }

  async obtenerPorNombre(nombre_ciudad) {
    const query = 'SELECT * FROM ciudad WHERE LOWER(nombre_ciudad) = LOWER($1)';
    const { rows } = await pool.query(query, [nombre_ciudad]);
    return rows[0] || null;
  }

  async actualizar(id_ciudad, campos) {
    const { nombre_ciudad } = campos;
    const query = `
      UPDATE ciudad
      SET nombre_ciudad = COALESCE($1, nombre_ciudad)
      WHERE id_ciudad = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre_ciudad, id_ciudad]);
    return rows[0] || null;
  }

  async eliminar(id_ciudad) {
    const query = 'DELETE FROM ciudad WHERE id_ciudad = $1 RETURNING *';
    const { rows } = await pool.query(query, [id_ciudad]);
    return rows[0] || null;
  }
}

module.exports = new CiudadDAO();
