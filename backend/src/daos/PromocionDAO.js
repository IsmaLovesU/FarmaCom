const pool = require('../database/db');

class PromocionDAO {

  async crear({ id_producto, id_sucursal, id_presentacion, cantidad_minima, precio_promocion, fecha_inicio, fecha_fin }) {
    const query = `
      INSERT INTO promocion (
        id_producto, id_sucursal, id_presentacion,
        cantidad_minima, precio_promocion,
        fecha_inicio, fecha_fin
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const valores = [
      id_producto,
      id_sucursal,
      id_presentacion,
      cantidad_minima,
      precio_promocion,
      fecha_inicio,
      fecha_fin,
    ];
    const { rows } = await pool.query(query, valores);
    return rows[0];
  }

  async obtenerPorProducto(id_producto) {
    const query = `
      SELECT
        pr.*,
        s.nombre_sucursal,
        p.nombre AS presentacion_nombre
      FROM promocion pr
      JOIN sucursal     s ON s.id_sucursal      = pr.id_sucursal
      JOIN presentacion p ON p.id_presentacion  = pr.id_presentacion
      WHERE pr.id_producto = $1
      ORDER BY pr.fecha_inicio DESC
    `;
    const { rows } = await pool.query(query, [id_producto]);
    return rows;
  }

  async obtenerPorId(id_promocion) {
    const query = `
      SELECT
        pr.*,
        s.nombre_sucursal,
        p.nombre AS presentacion_nombre
      FROM promocion pr
      JOIN sucursal     s ON s.id_sucursal      = pr.id_sucursal
      JOIN presentacion p ON p.id_presentacion  = pr.id_presentacion
      WHERE pr.id_promocion = $1
    `;
    const { rows } = await pool.query(query, [id_promocion]);
    return rows[0] || null;
  }

  // Verifica si ya existe una promoción activa para el mismo producto + sucursal + presentación
  async existeActivaSolapada({ id_producto, id_sucursal, id_presentacion, fecha_inicio, fecha_fin, excluir_id = null }) {
    const query = `
      SELECT 1 FROM promocion
      WHERE id_producto     = $1
        AND id_sucursal     = $2
        AND id_presentacion = $3
        AND activo          = true
        AND fecha_inicio    <= $5
        AND fecha_fin       >= $4
        ${excluir_id ? 'AND id_promocion <> $6' : ''}
      LIMIT 1
    `;
    const valores = excluir_id
      ? [id_producto, id_sucursal, id_presentacion, fecha_inicio, fecha_fin, excluir_id]
      : [id_producto, id_sucursal, id_presentacion, fecha_inicio, fecha_fin];

    const { rows } = await pool.query(query, valores);
    return rows.length > 0;
  }

  async actualizar(id_promocion, campos) {
    const { cantidad_minima, precio_promocion, fecha_inicio, fecha_fin } = campos;
    const query = `
      UPDATE promocion SET
        cantidad_minima  = COALESCE($1, cantidad_minima),
        precio_promocion = COALESCE($2, precio_promocion),
        fecha_inicio     = COALESCE($3, fecha_inicio),
        fecha_fin        = COALESCE($4, fecha_fin)
      WHERE id_promocion = $5
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      cantidad_minima  ?? null,
      precio_promocion ?? null,
      fecha_inicio     ?? null,
      fecha_fin        ?? null,
      id_promocion,
    ]);
    return rows[0] || null;
  }

  // Cancelación manual antes de fecha_fin
  async cambiarActivo(id_promocion, activo) {
    const { rows } = await pool.query(
      `UPDATE promocion SET activo = $1 WHERE id_promocion = $2 RETURNING *`,
      [activo, id_promocion],
    );
    return rows[0] || null;
  }

  // Permitido según decisión de negocio
  async eliminar(id_promocion) {
    const { rows } = await pool.query(
      `DELETE FROM promocion WHERE id_promocion = $1 RETURNING *`,
      [id_promocion],
    );
    return rows[0] || null;
  }
}

module.exports = new PromocionDAO();