const pool = require('../database/db');

class InventarioDAO {
  async obtenerPorSucursal(id_sucursal) {
    const query = `
      SELECT
        p.id_producto,
        p.codigo,
        p.nombre_comercial,
        p.nombre_generico,
        p.concentracion,
        p.presentacion,
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
          -- Un lote histórico agotado no agota el producto si otro lote tiene stock.
          WHEN COALESCE(SUM(v.stock_actual), 0) = 0
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
        p.concentracion, p.presentacion,
        p.stock_minimo, p.meses_alerta_vencimiento, p.aplica_mayoreo, p.activo,
        c.nombre, cf.nombre, pr.nombre

      ORDER BY
        -- Primero los críticos
        CASE
          WHEN COUNT(*) FILTER (WHERE v.estado_vencimiento = 'vencido') > 0 THEN 1
          WHEN COALESCE(SUM(v.stock_actual), 0) = 0                         THEN 2
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
      WITH estado_por_producto AS (
        SELECT
          p.id_producto,
          COALESCE(SUM(v.stock_actual), 0) AS stock_total,
          BOOL_OR(v.estado_vencimiento = 'vencido') AS tiene_vencidos,
          BOOL_OR(v.estado_vencimiento = 'proximo_a_vencer') AS tiene_proximos_vencer,
          BOOL_OR(v.estado_stock = 'poco_stock') AS tiene_poco_stock
        FROM producto p
        JOIN v_lote_estado v ON v.id_producto = p.id_producto
                            AND v.id_sucursal = $1
        GROUP BY p.id_producto
      )
      SELECT
        COUNT(*) AS total_productos,
        COUNT(*) FILTER (
          WHERE tiene_vencidos OR stock_total = 0
        ) AS productos_criticos,
        COUNT(*) FILTER (
          WHERE NOT tiene_vencidos
            AND stock_total > 0
            AND tiene_proximos_vencer
        ) AS productos_proximos_vencer,
        COUNT(*) FILTER (
          WHERE NOT tiene_vencidos
            AND stock_total > 0
            AND NOT tiene_proximos_vencer
            AND NOT tiene_poco_stock
        ) AS productos_optimos
      FROM estado_por_producto
    `;

    const { rows } = await pool.query(query, [id_sucursal]);
    return rows[0];
  }
}

module.exports = new InventarioDAO();