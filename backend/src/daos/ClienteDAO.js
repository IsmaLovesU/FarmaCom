const pool = require('../database/db');

class ClienteDAO {
  async crear({ nombre_cliente, observaciones }) {
    const { rows } = await pool.query(
      `INSERT INTO cliente (nombre_cliente, observaciones)
       VALUES ($1, $2) RETURNING *`,
      [nombre_cliente, observaciones || null],
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

  async actualizar(id_cliente, { nombre_cliente, observaciones }) {
    const { rows } = await pool.query(
      `UPDATE cliente
       SET nombre_cliente = COALESCE($1, nombre_cliente),
           observaciones = $2
       WHERE id_cliente = $3
       RETURNING *`,
      [nombre_cliente, observaciones, id_cliente],
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
