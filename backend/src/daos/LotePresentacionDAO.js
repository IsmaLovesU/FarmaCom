const pool = require('../database/db');

class LotePresentacionDAO {

  // CREATE 

  async crear({ id_lote, id_presentacion, precio_venta, margen_ganancia, precio_mayoreo, cantidad_mayoreo }) {
    const query = `
      INSERT INTO lote_presentacion (
        id_lote, id_presentacion,
        precio_venta, margen_ganancia,
        precio_mayoreo, cantidad_mayoreo
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      id_lote,
      id_presentacion,
      precio_venta,
      margen_ganancia,
      precio_mayoreo   ?? null,
      cantidad_mayoreo ?? null,
    ]);
    return rows[0];
  }

  // OBTENER

  async obtenerPorLote(id_lote) {
    const query = `
      SELECT
        lp.*,
        pres.nombre            AS presentacion_nombre,
        pres.factor_conversion,
        pres.es_base
      FROM lote_presentacion lp
      JOIN presentacion pres ON pres.id_presentacion = lp.id_presentacion
      WHERE lp.id_lote = $1
      ORDER BY pres.factor_conversion ASC
    `;
    const { rows } = await pool.query(query, [id_lote]);
    return rows;
  }

  async obtenerPorId(id_lote, id_presentacion) {
    const query = `
      SELECT
        lp.*,
        pres.nombre            AS presentacion_nombre,
        pres.factor_conversion,
        pres.es_base
      FROM lote_presentacion lp
      JOIN presentacion pres ON pres.id_presentacion = lp.id_presentacion
      WHERE lp.id_lote = $1 AND lp.id_presentacion = $2
    `;
    const { rows } = await pool.query(query, [id_lote, id_presentacion]);
    return rows[0] || null;
  }

  // UPDATE

  async actualizar(id_lote, id_presentacion, campos) {
    const { precio_venta, margen_ganancia, precio_mayoreo, cantidad_mayoreo } = campos;
    const query = `
      UPDATE lote_presentacion SET
        precio_venta     = COALESCE($1, precio_venta),
        margen_ganancia  = COALESCE($2, margen_ganancia),
        precio_mayoreo   = COALESCE($3, precio_mayoreo),
        cantidad_mayoreo = COALESCE($4, cantidad_mayoreo)
      WHERE id_lote = $5 AND id_presentacion = $6
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      precio_venta     ?? null,
      margen_ganancia  ?? null,
      precio_mayoreo   ?? null,
      cantidad_mayoreo ?? null,
      id_lote,
      id_presentacion,
    ]);
    return rows[0] || null;
  }

  // Permite limpiar precio_mayoreo y cantidad_mayoreo, setear a NULL explícitamente
  async limpiarMayoreo(id_lote, id_presentacion) {
    const query = `
      UPDATE lote_presentacion
      SET precio_mayoreo = NULL, cantidad_mayoreo = NULL
      WHERE id_lote = $1 AND id_presentacion = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_lote, id_presentacion]);
    return rows[0] || null;
  }

  // DELETE

  async eliminar(id_lote, id_presentacion) {
    const query = `
      DELETE FROM lote_presentacion
      WHERE id_lote = $1 AND id_presentacion = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_lote, id_presentacion]);
    return rows[0] || null;
  }
}

module.exports = new LotePresentacionDAO();