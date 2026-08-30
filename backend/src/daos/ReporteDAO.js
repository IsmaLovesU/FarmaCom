const pool = require('../database/db');

class ReporteDAO {
  async obtenerMetricas({
    id_sucursal,
    fecha_desde,
    fecha_hasta,
    limite = 5,
  } = {}) {
    const { rows } = await pool.query(
      `WITH ventas_filtradas AS (
         SELECT v.id_venta, v.total
         FROM venta v
         WHERE v.estado = 'completada'
           AND ($1::INTEGER IS NULL OR v.id_sucursal = $1)
           AND ($2::DATE IS NULL OR v.fecha_venta >= $2::DATE)
           AND ($3::DATE IS NULL OR v.fecha_venta < ($3::DATE + INTERVAL '1 day'))
       ),
       resumen AS (
         SELECT
           COALESCE(SUM(vf.total), 0)::NUMERIC(14,2) AS ingresos_totales,
           COUNT(*)::INTEGER AS total_ventas
         FROM ventas_filtradas vf
       ),
       top_productos AS (
         SELECT
           p.id_producto,
           p.codigo,
           p.nombre_comercial,
           p.nombre_generico,
           SUM(dv.cantidad)::INTEGER AS cantidad_vendida,
           SUM(dv.subtotal)::NUMERIC(14,2)::TEXT AS ingresos_generados
         FROM ventas_filtradas vf
         JOIN detalle_venta dv ON dv.id_venta = vf.id_venta
         JOIN lote l ON l.id_lote = dv.id_lote
         JOIN producto p ON p.id_producto = l.id_producto
         GROUP BY p.id_producto, p.codigo, p.nombre_comercial, p.nombre_generico
         ORDER BY cantidad_vendida DESC, SUM(dv.subtotal) DESC, p.id_producto ASC
         LIMIT $4
       )
       SELECT
         r.ingresos_totales,
         r.total_ventas,
         COALESCE(
           (SELECT JSON_AGG(
              tp ORDER BY
                tp.cantidad_vendida DESC,
                tp.ingresos_generados::NUMERIC DESC,
                tp.id_producto ASC
            )
            FROM top_productos tp),
           '[]'::JSON
         ) AS top_productos
       FROM resumen r`,
      [id_sucursal || null, fecha_desde || null, fecha_hasta || null, limite],
    );

    return rows[0];
  }
}

module.exports = new ReporteDAO();
