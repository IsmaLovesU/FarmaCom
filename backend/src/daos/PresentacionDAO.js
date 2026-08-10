const pool = require('../database/db');

class PresentacionDAO {
  async crear({ nombre }) {
    const { rows } = await pool.query(
      `INSERT INTO presentacion (nombre)
       VALUES ($1)
       RETURNING *`,
      [nombre],
    );
    return rows[0];
  }

  async obtenerTodos() {
    const { rows } = await pool.query(
      `SELECT
         pr.*,
         COUNT(p.id_producto)::INTEGER AS productos_asociados
       FROM presentacion pr
       LEFT JOIN producto p ON p.id_presentacion = pr.id_presentacion
       GROUP BY pr.id_presentacion
       ORDER BY pr.nombre`,
    );
    return rows;
  }

  async obtenerPorId(id_presentacion) {
    const { rows } = await pool.query(
      `SELECT
         pr.*,
         COUNT(p.id_producto)::INTEGER AS productos_asociados
       FROM presentacion pr
       LEFT JOIN producto p ON p.id_presentacion = pr.id_presentacion
       WHERE pr.id_presentacion = $1
       GROUP BY pr.id_presentacion`,
      [id_presentacion],
    );
    return rows[0] || null;
  }

  async obtenerPorNombre(nombre) {
    const { rows } = await pool.query(
      'SELECT * FROM presentacion WHERE LOWER(TRIM(nombre)) = LOWER(TRIM($1))',
      [nombre],
    );
    return rows[0] || null;
  }

  async actualizar(id_presentacion, { nombre }) {
    const { rows } = await pool.query(
      `UPDATE presentacion
       SET nombre = COALESCE($1, nombre)
       WHERE id_presentacion = $2
       RETURNING *`,
      [nombre ?? null, id_presentacion],
    );
    return rows[0] || null;
  }

  async eliminar(id_presentacion) {
    const { rows } = await pool.query(
      'DELETE FROM presentacion WHERE id_presentacion = $1 RETURNING *',
      [id_presentacion],
    );
    return rows[0] || null;
  }
}

module.exports = new PresentacionDAO();
