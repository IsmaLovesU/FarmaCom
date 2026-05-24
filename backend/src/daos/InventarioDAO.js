const pool = require('../database/db');

class InventarioDAO {
  async obtenerPorSucursal(id_sucursal) {
    const query = `
      SELECT
        p.id_producto,
        p.codigo,
        p.nombre_comercial,
        p.nombre_generico,
        p.stock_minimo,
        p.meses_alerta_vencimiento,
        p.aplica_mayoreo,
        p.activo,
        c.nombre                        AS categoria_nombre,
        cf.nombre                       AS casa_nombre,
        pr.nombre                       AS proveedor_nombre,

        -- Stock total del producto en esta sucursal (unidades atómicas)
        COALESCE(SUM(v.stock_actual), 0) AS stock_total,

        -- Conteo de lotes por estado_vencimiento
        COUNT(*) FILTER (
          WHERE v.estado_vencimiento = 'vencido'
        )                               AS lotes_vencidos,

        COUNT(*) FILTER (
          WHERE v.estado_vencimiento = 'proximo_a_vencer'
        )                               AS lotes_proximos_vencer,

        -- Conteo de lotes por estado_stock
        COUNT(*) FILTER (
          WHERE v.estado_stock = 'agotado'
        )                               AS lotes_agotados,

        COUNT(*) FILTER (
          WHERE v.estado_stock = 'poco_stock'
        )                               AS lotes_poco_stock,

        COUNT(*)                        AS total_lotes,

        -- Estado consolidado más crítico del producto
        CASE
          WHEN COUNT(*) FILTER (WHERE v.estado_vencimiento = 'vencido') > 0
            THEN 'vencido'
          WHEN COUNT(*) FILTER (WHERE v.estado_stock = 'agotado') > 0
            THEN 'agotado'
          WHEN COUNT(*) FILTER (WHERE v.estado_vencimiento = 'proximo_a_vencer') > 0
            THEN 'proximo_a_vencer'
          WHEN COUNT(*) FILTER (WHERE v.estado_stock = 'poco_stock') > 0
            THEN 'poco_stock'
          ELSE 'normal'
        END                             AS estado_consolidado

      FROM producto p
      JOIN categoria         c   ON c.id_categoria  = p.id_categoria
      JOIN casa_farmaceutica cf  ON cf.id_casa       = p.id_casa
      LEFT JOIN proveedor    pr  ON pr.id_proveedor  = p.id_proveedor
      JOIN v_lote_estado     v   ON v.id_producto    = p.id_producto
                                AND v.id_sucursal    = $1

      GROUP BY
        p.id_producto, p.codigo, p.nombre_comercial, p.nombre_generico,
        p.stock_minimo, p.meses_alerta_vencimiento, p.aplica_mayoreo, p.activo,
        c.nombre, cf.nombre, pr.nombre

      ORDER BY
        -- Primero los críticos
        CASE
          WHEN COUNT(*) FILTER (WHERE v.estado_vencimiento = 'vencido') > 0 THEN 1
          WHEN COUNT(*) FILTER (WHERE v.estado_stock = 'agotado') > 0       THEN 2
          WHEN COUNT(*) FILTER (WHERE v.estado_vencimiento = 'proximo_a_vencer') > 0 THEN 3
          WHEN COUNT(*) FILTER (WHERE v.estado_stock = 'poco_stock') > 0    THEN 4
          ELSE 5
        END,
        p.nombre_comercial ASC
    `;

    const { rows } = await pool.query(query, [id_sucursal]);
    return rows;
  }

  async obtenerResumenPorSucursal(id_sucursal) {
    const query = `
      SELECT
        COUNT(DISTINCT p.id_producto)                                        AS total_productos,

        COUNT(DISTINCT p.id_producto) FILTER (
          WHERE EXISTS (
            SELECT 1 FROM v_lote_estado v2
            WHERE v2.id_producto = p.id_producto
              AND v2.id_sucursal = $1
              AND (v2.estado_vencimiento = 'vencido' OR v2.estado_stock = 'agotado')
          )
        )                                                                     AS productos_criticos,

        COUNT(DISTINCT p.id_producto) FILTER (
          WHERE EXISTS (
            SELECT 1 FROM v_lote_estado v2
            WHERE v2.id_producto = p.id_producto
              AND v2.id_sucursal = $1
              AND v2.estado_vencimiento = 'proximo_a_vencer'
          )
          AND NOT EXISTS (
            SELECT 1 FROM v_lote_estado v3
            WHERE v3.id_producto = p.id_producto
              AND v3.id_sucursal = $1
              AND (v3.estado_vencimiento = 'vencido' OR v3.estado_stock = 'agotado')
          )
        )                                                                     AS productos_proximos_vencer,

        COUNT(DISTINCT p.id_producto) FILTER (
          WHERE NOT EXISTS (
            SELECT 1 FROM v_lote_estado v2
            WHERE v2.id_producto = p.id_producto
              AND v2.id_sucursal = $1
              AND (
                v2.estado_vencimiento != 'normal'
                OR v2.estado_stock     != 'normal'
              )
          )
        )                                                                     AS productos_optimos

      FROM producto p
      JOIN v_lote_estado v ON v.id_producto = p.id_producto
                          AND v.id_sucursal  = $1
    `;

    const { rows } = await pool.query(query, [id_sucursal]);
    return rows[0];
  }
}

module.exports = new InventarioDAO();