const pool = require('../database/db');

class SucursalDAO {

  // CREATE

  async crear({ id_ciudad, nombre_sucursal, direccion }) {
    const query = `
      INSERT INTO sucursal (id_ciudad, nombre_sucursal, direccion)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_ciudad, nombre_sucursal, direccion]);
    return rows[0];
  }

  // OBTENER 

  async obtenerTodos() {
    const query = `SELECT * FROM sucursal ORDER BY id_sucursal`;
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id_sucursal) {
    const query = `SELECT * FROM sucursal WHERE id_sucursal = $1`;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows[0] || null;
  }

  async obtenerPorNombre(nombre_sucursal) {
    const query = `SELECT * FROM sucursal WHERE LOWER(nombre_sucursal) = LOWER($1)`;
    const { rows } = await pool.query(query, [nombre_sucursal]);
    return rows[0] || null;
  }

  // UPDATE

  async actualizar(id_sucursal, campos) {
    const { id_ciudad, nombre_sucursal, direccion } = campos;
    const query = `
      UPDATE sucursal
      SET
        id_ciudad       = COALESCE($1, id_ciudad),
        nombre_sucursal = COALESCE($2, nombre_sucursal),
        direccion       = COALESCE($3, direccion)
      WHERE id_sucursal = $4
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_ciudad, nombre_sucursal, direccion, id_sucursal]);
    return rows[0] || null;
  }

  // DELETE

  async eliminar(id_sucursal) {
    const query = `DELETE FROM sucursal WHERE id_sucursal = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows[0] || null;
  }
}

module.exports = new SucursalDAO();