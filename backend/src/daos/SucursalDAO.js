const pool = require('../database/db');

class SucursalDAO {

  async crear({ id_ciudad, nombre_sucursal, direccion }) {
    if (!id_ciudad || !nombre_sucursal?.trim() || !direccion?.trim()) {
      throw new Error('id_ciudad, nombre_sucursal y direccion son requeridos');
    }

    const existe = await pool.query(
      'SELECT id_sucursal FROM sucursal WHERE LOWER(nombre_sucursal) = LOWER($1)',
      [nombre_sucursal.trim()]
    );
    if (existe.rows.length > 0) {
      throw new Error(`Ya existe una sucursal con el nombre "${nombre_sucursal.trim()}"`);
    }

    const query = `
      INSERT INTO sucursal (id_ciudad, nombre_sucursal, direccion)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      id_ciudad,
      nombre_sucursal.trim(),
      direccion.trim()
    ]);
    return rows[0];
  }

  async listar() {
    const query = `SELECT * FROM sucursal ORDER BY id_sucursal ASC`;
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id_sucursal) {
    if (!id_sucursal || isNaN(id_sucursal)) {
      throw new Error('El id_sucursal debe ser un número válido');
    }

    const query = `SELECT * FROM sucursal WHERE id_sucursal = $1`;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows[0] || null;
  }
}

module.exports = new SucursalDAO();