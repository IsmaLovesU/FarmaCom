const pool = require('../database/db');

class TelefonoSucursalDAO {

  // ─── CREATE ────

  async crear({ id_sucursal, numero }) {
    const query = `
      INSERT INTO telefono_sucursal (id_sucursal, numero)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_sucursal, numero]);
    return rows[0];
  }

  // ─── OBTENER ────

  async obtenerTodos() {
    const query = `SELECT * FROM telefono_sucursal ORDER BY id_telefono_sucursal`;
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id_telefono_sucursal) {
    const query = `SELECT * FROM telefono_sucursal WHERE id_telefono_sucursal = $1`;
    const { rows } = await pool.query(query, [id_telefono_sucursal]);
    return rows[0] || null;
  }

  async obtenerPorSucursal(id_sucursal) {
    const query = `
      SELECT * FROM telefono_sucursal
      WHERE id_sucursal = $1
      ORDER BY id_telefono_sucursal
    `;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows;
  }

  // ─── UPDATE ────

  async actualizar(id_telefono_sucursal, { numero }) {
    const query = `
      UPDATE telefono_sucursal
      SET numero = COALESCE($1, numero)
      WHERE id_telefono_sucursal = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [numero, id_telefono_sucursal]);
    return rows[0] || null;
  }

  // ─── DELETE ────

  async eliminar(id_telefono_sucursal) {
    const query = `
      DELETE FROM telefono_sucursal
      WHERE id_telefono_sucursal = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_telefono_sucursal]);
    return rows[0] || null;
  }

  async eliminarPorSucursal(id_sucursal) {
    const query = `
      DELETE FROM telefono_sucursal
      WHERE id_sucursal = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows;
  }
}

module.exports = new TelefonoSucursalDAO();