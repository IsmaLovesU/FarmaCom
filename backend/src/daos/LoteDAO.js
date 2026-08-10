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
    precio_venta,
    margen_ganancia,
    precio_mayoreo,
    cantidad_mayoreo,
  }) {
    const query = `
      INSERT INTO lote (
        id_producto, id_proveedor, id_sucursal,
        numero_lote, fecha_vencimiento,
        cantidad_ingresada, stock_actual,
        precio_venta, margen_ganancia, precio_mayoreo, cantidad_mayoreo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      id_producto,
      id_proveedor,
      id_sucursal,
      numero_lote,
      fecha_vencimiento,
      cantidad_ingresada,
      precio_venta,
      margen_ganancia,
      precio_mayoreo   ?? null,
      cantidad_mayoreo ?? null,
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
        p.concentracion,
        pre.nombre AS presentacion,
        pr.nombre AS proveedor_nombre
      FROM v_lote_estado v
      JOIN producto  p  ON p.id_producto   = v.id_producto
      JOIN presentacion pre ON pre.id_presentacion = p.id_presentacion
      JOIN proveedor pr ON pr.id_proveedor = v.id_proveedor
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
        p.concentracion,
        pre.nombre AS presentacion,
        s.nombre_sucursal,
        pr.nombre AS proveedor_nombre
      FROM v_lote_estado v
      JOIN producto  p  ON p.id_producto   = v.id_producto
      JOIN presentacion pre ON pre.id_presentacion = p.id_presentacion
      JOIN sucursal  s  ON s.id_sucursal   = v.id_sucursal
      JOIN proveedor pr ON pr.id_proveedor = v.id_proveedor
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
        p.concentracion,
        pre.nombre AS presentacion,
        s.nombre_sucursal,
        pr.nombre AS proveedor_nombre
      FROM v_lote_estado v
      JOIN producto  p  ON p.id_producto   = v.id_producto
      JOIN presentacion pre ON pre.id_presentacion = p.id_presentacion
      JOIN sucursal  s  ON s.id_sucursal   = v.id_sucursal
      JOIN proveedor pr ON pr.id_proveedor = v.id_proveedor
      WHERE v.id_lote = $1
    `;
    const { rows } = await pool.query(query, [id_lote]);
    return rows[0] || null;
  }

  // Busca si ya existe el mismo número de lote para ese producto y sucursal
  async obtenerPorNumeroLote(numero_lote, id_producto, id_sucursal, excluir_id = null) {
    const query = `
      SELECT * FROM lote
      WHERE LOWER(numero_lote) = LOWER($1)
        AND id_producto  = $2
        AND id_sucursal  = $3
        AND ($4::INTEGER IS NULL OR id_lote != $4)
    `;
    const { rows } = await pool.query(query, [numero_lote, id_producto, id_sucursal, excluir_id]);
    return rows[0] || null;
  }

  // UPDATE

  // Permite editar los datos propios del lote.
  async actualizar(id_lote, campos) {
    const {
      id_producto,
      id_proveedor,
      id_sucursal,
      numero_lote,
      fecha_vencimiento,
      cantidad_ingresada,
      stock_actual,
      precio_venta,
      margen_ganancia,
      precio_mayoreo,
      cantidad_mayoreo,
      limpiar_mayoreo,
    } = campos;

    const query = `
      UPDATE lote SET
        id_producto        = COALESCE($1, id_producto),
        id_proveedor       = COALESCE($2, id_proveedor),
        id_sucursal        = COALESCE($3, id_sucursal),
        numero_lote        = COALESCE($4, numero_lote),
        fecha_vencimiento  = COALESCE($5, fecha_vencimiento),
        cantidad_ingresada = COALESCE($6, cantidad_ingresada),
        stock_actual       = COALESCE($7, stock_actual),
        precio_venta       = COALESCE($8, precio_venta),
        margen_ganancia    = COALESCE($9, margen_ganancia),
        precio_mayoreo     = CASE WHEN $12 THEN NULL ELSE COALESCE($10, precio_mayoreo) END,
        cantidad_mayoreo   = CASE WHEN $12 THEN NULL ELSE COALESCE($11, cantidad_mayoreo) END
      WHERE id_lote = $13
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      id_producto        ?? null,
      id_proveedor       ?? null,
      id_sucursal        ?? null,
      numero_lote        ?? null,
      fecha_vencimiento  ?? null,
      cantidad_ingresada ?? null,
      stock_actual       ?? null,
      precio_venta       ?? null,
      margen_ganancia    ?? null,
      precio_mayoreo     ?? null,
      cantidad_mayoreo   ?? null,
      limpiar_mayoreo    === true,
      id_lote,
    ]);
    return rows[0] || null;
  }

  // DELETE

  async eliminar(id_lote) {
    const { rows } = await pool.query(
      'DELETE FROM lote WHERE id_lote = $1 RETURNING *',
      [id_lote],
    );
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
        p.concentracion,
        pre.nombre AS presentacion,
        s.nombre_sucursal,
        pr.nombre AS proveedor_nombre
      FROM v_lote_estado v
      JOIN producto  p  ON p.id_producto   = v.id_producto
      JOIN presentacion pre ON pre.id_presentacion = p.id_presentacion
      JOIN sucursal  s  ON s.id_sucursal   = v.id_sucursal
      JOIN proveedor pr ON pr.id_proveedor = v.id_proveedor
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
