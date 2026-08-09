const pool = require('../database/db');

class ClienteDAO {
  async crear({ nombre_cliente, nit, observaciones }) {
    const { rows } = await pool.query(
      `INSERT INTO cliente (nombre_cliente, nit, observaciones)
       VALUES ($1, $2, $3) RETURNING *`,
      [nombre_cliente, nit ?? null, observaciones || null],
    );
    return rows[0];
  }

  async obtenerTodos() {
    const { rows } = await pool.query(
      'SELECT * FROM cliente ORDER BY nombre_cliente, id_cliente',
    );
    return rows;
  }

  async obtenerPorId(id_cliente) {
    const { rows } = await pool.query(
      'SELECT * FROM cliente WHERE id_cliente = $1',
      [id_cliente],
    );
    return rows[0] || null;
  }

  async obtenerPorNit(nit) {
    const { rows } = await pool.query(
      'SELECT * FROM cliente WHERE nit = $1',
      [nit],
    );
    return rows[0] || null;
  }

  async actualizar(id_cliente, campos) {
    const { nombre_cliente, observaciones, nit } = campos;
    const incluyeNit = Object.prototype.hasOwnProperty.call(campos, 'nit');
    const { rows } = await pool.query(
      `UPDATE cliente
       SET nombre_cliente = COALESCE($1, nombre_cliente),
           observaciones = $2,
           nit = CASE WHEN $3 THEN $4 ELSE nit END
       WHERE id_cliente = $5
       RETURNING *`,
      [nombre_cliente, observaciones, incluyeNit, nit ?? null, id_cliente],
    );
    return rows[0] || null;
  }

  async eliminar(id_cliente) {
    const { rows } = await pool.query(
      'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *',
      [id_cliente],
    );
    return rows[0] || null;
  }
}

module.exports = new ClienteDAO();
