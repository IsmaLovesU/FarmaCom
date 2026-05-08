const pool = require('../database/db');

class PresentacionDAO {

  async crear({ id_producto, nombre, factor_conversion, es_base }) {
    const query = `
      INSERT INTO presentacion (id_producto, nombre, factor_conversion, es_base)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_producto, nombre, factor_conversion, es_base ?? false]);
    return rows[0];
  }

  async obtenerPorProducto(id_producto) {
    const { rows } = await pool.query(
      `SELECT * FROM presentacion WHERE id_producto = $1 ORDER BY id_presentacion`,
      [id_producto],
    );
    return rows;
  }

  async obtenerPorId(id_presentacion) {
    const { rows } = await pool.query(
      `SELECT * FROM presentacion WHERE id_presentacion = $1`,
      [id_presentacion],
    );
    return rows[0] || null;
  }

  // Busca la presentación base activa de un producto
  async obtenerBaseActiva(id_producto, excluir_id = null) {
    const query = excluir_id
      ? `SELECT * FROM presentacion WHERE id_producto = $1 AND es_base = true AND activo = true AND id_presentacion <> $2 LIMIT 1`
      : `SELECT * FROM presentacion WHERE id_producto = $1 AND es_base = true AND activo = true LIMIT 1`;

    const valores = excluir_id ? [id_producto, excluir_id] : [id_producto];
    const { rows } = await pool.query(query, valores);
    return rows[0] || null;
  }

  async desmarcarBase(id_producto, excluir_id) {
    await pool.query(
      `UPDATE presentacion SET es_base = false
       WHERE id_producto = $1 AND id_presentacion <> $2 AND activo = true`,
      [id_producto, excluir_id],
    );
  }

  async actualizar(id_presentacion, campos) {
    const { nombre, factor_conversion, es_base } = campos;
    const query = `
      UPDATE presentacion SET
        nombre            = COALESCE($1, nombre),
        factor_conversion = COALESCE($2, factor_conversion),
        es_base           = COALESCE($3, es_base)
      WHERE id_presentacion = $4
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      nombre            ?? null,
      factor_conversion ?? null,
      es_base           ?? null,
      id_presentacion,
    ]);
    return rows[0] || null;
  }

  async cambiarActivo(id_presentacion, activo) {
    const { rows } = await pool.query(
      `UPDATE presentacion SET activo = $1 WHERE id_presentacion = $2 RETURNING *`,
      [activo, id_presentacion],
    );
    return rows[0] || null;
  }

  // Verifica si la presentación tiene lotes asociados
  async tieneLotes(id_presentacion) {
    const { rows } = await pool.query(
      `SELECT 1 FROM lote WHERE presentacion_ingreso = $1 LIMIT 1`,
      [id_presentacion],
    );
    return rows.length > 0;
  }

  // Cuenta las presentaciones activas de un producto
  async contarActivasPorProducto(id_producto) {
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS total FROM presentacion WHERE id_producto = $1 AND activo = true`,
      [id_producto],
    );
    return parseInt(rows[0].total, 10);
  }
}

module.exports = new PresentacionDAO();