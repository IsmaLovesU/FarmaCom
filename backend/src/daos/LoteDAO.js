const pool = require('../database/db');

class LoteDAO {

  // CREATE

  async crear({
    id_producto,
    id_proveedor,
    id_sucursal,
    numero_lote,
    fecha_vencimiento,
    cantidad_ingresada,
    presentacion_ingreso,
    stock_inicial,
  }) {
    const query = `
      INSERT INTO lote (
        id_producto, id_proveedor, id_sucursal,
        numero_lote, fecha_vencimiento,
        cantidad_ingresada, presentacion_ingreso,
        stock_inicial, stock_actual
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      id_producto,
      id_proveedor,
      id_sucursal,
      numero_lote,
      fecha_vencimiento,
      cantidad_ingresada,
      presentacion_ingreso,
      stock_inicial,
    ]);
    return rows[0];
  }

  // OBTENER

  // Lista todos los lotes de una sucursal con estados calculados utilizando la vista v_lote_estado
  async obtenerPorSucursal(id_sucursal) {
    const query = `
      SELECT
        v.*,
        p.nombre_comercial,
        p.nombre_generico,
        pr.nombre            AS proveedor_nombre,
        pres.nombre          AS presentacion_nombre,
        pres.factor_conversion
      FROM v_lote_estado v
      JOIN producto     p    ON p.id_producto        = v.id_producto
      JOIN proveedor    pr   ON pr.id_proveedor       = v.id_proveedor
      JOIN presentacion pres ON pres.id_presentacion  = v.presentacion_ingreso
      WHERE v.id_sucursal = $1
      ORDER BY v.fecha_vencimiento ASC, v.id_lote
    `;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows;
  }

  // Lista todos los lotes de un producto en todas las sucursales
  async obtenerPorProducto(id_producto) {
    const query = `
      SELECT
        v.*,
        s.nombre_sucursal,
        pr.nombre  AS proveedor_nombre,
        pres.nombre AS presentacion_nombre,
        pres.factor_conversion
      FROM v_lote_estado v
      JOIN sucursal     s    ON s.id_sucursal          = v.id_sucursal
      JOIN proveedor    pr   ON pr.id_proveedor         = v.id_proveedor
      JOIN presentacion pres ON pres.id_presentacion    = v.presentacion_ingreso
      WHERE v.id_producto = $1
      ORDER BY v.fecha_vencimiento ASC, v.id_lote
    `;
    const { rows } = await pool.query(query, [id_producto]);
    return rows;
  }

  async obtenerPorId(id_lote) {
    const query = `
      SELECT
        v.*,
        p.nombre_comercial,
        p.nombre_generico,
        s.nombre_sucursal,
        pr.nombre  AS proveedor_nombre,
        pres.nombre AS presentacion_nombre,
        pres.factor_conversion
      FROM v_lote_estado v
      JOIN producto     p    ON p.id_producto         = v.id_producto
      JOIN sucursal     s    ON s.id_sucursal          = v.id_sucursal
      JOIN proveedor    pr   ON pr.id_proveedor        = v.id_proveedor
      JOIN presentacion pres ON pres.id_presentacion   = v.presentacion_ingreso
      WHERE v.id_lote = $1
    `;
    const { rows } = await pool.query(query, [id_lote]);
    return rows[0] || null;
  }

  // Busca si ya existe el mismo número de lote para ese producto y sucursal
  async obtenerPorNumeroLote(numero_lote, id_producto, id_sucursal) {
    const query = `
      SELECT * FROM lote
      WHERE LOWER(numero_lote) = LOWER($1)
        AND id_producto  = $2
        AND id_sucursal  = $3
    `;
    const { rows } = await pool.query(query, [numero_lote, id_producto, id_sucursal]);
    return rows[0] || null;
  }

  // UPDATE

  // Solo permite ajustar el stock y la fecha de vencimiento.
  async actualizar(id_lote, campos) {
    const { fecha_vencimiento, stock_actual } = campos;
    const query = `
      UPDATE lote SET
        fecha_vencimiento = COALESCE($1, fecha_vencimiento),
        stock_actual      = COALESCE($2, stock_actual)
      WHERE id_lote = $3
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      fecha_vencimiento ?? null,
      stock_actual      ?? null,
      id_lote,
    ]);
    return rows[0] || null;
  }

  // Decrementa el stock_actual en una cantidad dada
  async decrementarStock(id_lote, cantidad, client = pool) {
    const query = `
      UPDATE lote
      SET stock_actual = stock_actual - $1
      WHERE id_lote = $2
        AND stock_actual >= $1
      RETURNING *
    `;
    const { rows } = await client.query(query, [cantidad, id_lote]);
    return rows[0] || null;  // null si no había suficiente stock
  }

  // ALERTAS

  // Devuelve lotes con estado_vencimiento != 'normal' o estado_stock != 'normal'
  async obtenerAlertas(id_sucursal = null) {
    const condicionSucursal = id_sucursal ? 'AND v.id_sucursal = $1' : '';
    const valores           = id_sucursal ? [id_sucursal] : [];

    const query = `
      SELECT
        v.*,
        p.nombre_comercial,
        p.nombre_generico,
        s.nombre_sucursal,
        pr.nombre  AS proveedor_nombre,
        pres.nombre AS presentacion_nombre
      FROM v_lote_estado v
      JOIN producto     p    ON p.id_producto         = v.id_producto
      JOIN sucursal     s    ON s.id_sucursal          = v.id_sucursal
      JOIN proveedor    pr   ON pr.id_proveedor        = v.id_proveedor
      JOIN presentacion pres ON pres.id_presentacion   = v.presentacion_ingreso
      WHERE (v.estado_vencimiento != 'normal' OR v.estado_stock != 'normal')
      ${condicionSucursal}
      ORDER BY
        CASE v.estado_vencimiento WHEN 'vencido' THEN 1 WHEN 'proximo_a_vencer' THEN 2 ELSE 3 END,
        CASE v.estado_stock       WHEN 'agotado'  THEN 1 WHEN 'poco_stock'       THEN 2 ELSE 3 END,
        v.fecha_vencimiento ASC
    `;
    const { rows } = await pool.query(query, valores);
    return rows;
  }
}

module.exports = new LoteDAO();