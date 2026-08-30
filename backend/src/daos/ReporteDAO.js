const pool = require('../database/db');

class ReporteDAO {
  async obtenerResumenVentas({
    id_sucursal,
    fecha_desde,
    fecha_hasta,
  } = {}) {
    const { rows } = await pool.query(
      `WITH ventas_filtradas AS (
         SELECT v.id_venta, v.total
         FROM venta v
         WHERE v.estado = 'completada'
           AND ($1::INTEGER IS NULL OR v.id_sucursal = $1)
           AND (
             $2::DATE IS NULL
             OR v.fecha_venta >= (
               $2::DATE::TIMESTAMP AT TIME ZONE 'America/Guatemala'
             )
           )
           AND (
             $3::DATE IS NULL
             OR v.fecha_venta < (
               ($3::DATE + 1)::TIMESTAMP AT TIME ZONE 'America/Guatemala'
             )
           )
       ),
       resumen_ventas AS (
         SELECT
           COALESCE(SUM(vf.total), 0)::NUMERIC(14,2) AS ingresos_totales,
           COUNT(*)::INTEGER AS total_ventas,
           COALESCE(AVG(vf.total), 0)::NUMERIC(14,2) AS ticket_promedio
         FROM ventas_filtradas vf
       ),
       resumen_unidades AS (
         SELECT
           COALESCE(SUM(dv.cantidad), 0)::INTEGER AS unidades_vendidas
         FROM ventas_filtradas vf
         JOIN detalle_venta dv ON dv.id_venta = vf.id_venta
       )
       SELECT
         rv.ingresos_totales,
         rv.total_ventas,
         rv.ticket_promedio,
         ru.unidades_vendidas
       FROM resumen_ventas rv
       CROSS JOIN resumen_unidades ru`,
      [id_sucursal || null, fecha_desde || null, fecha_hasta || null],
    );

    return rows[0];
  }

  async obtenerTopProductos({
    id_sucursal,
    fecha_desde,
    fecha_hasta,
    limite = 5,
    criterio = 'cantidad',
  } = {}) {
    const orden = criterio === 'ingresos'
      ? 'ingresos_generados DESC, cantidad_vendida DESC'
      : 'cantidad_vendida DESC, ingresos_generados DESC';

    const { rows } = await pool.query(
      `WITH ventas_filtradas AS (
         SELECT v.id_venta
         FROM venta v
         WHERE v.estado = 'completada'
           AND ($1::INTEGER IS NULL OR v.id_sucursal = $1)
           AND (
             $2::DATE IS NULL
             OR v.fecha_venta >= (
               $2::DATE::TIMESTAMP AT TIME ZONE 'America/Guatemala'
             )
           )
           AND (
             $3::DATE IS NULL
             OR v.fecha_venta < (
               ($3::DATE + 1)::TIMESTAMP AT TIME ZONE 'America/Guatemala'
             )
           )
       )
       SELECT
         p.id_producto,
         p.codigo,
         p.nombre_comercial,
         p.nombre_generico,
         SUM(dv.cantidad)::INTEGER AS cantidad_vendida,
         SUM(dv.subtotal)::NUMERIC(14,2) AS ingresos_generados
       FROM ventas_filtradas vf
       JOIN detalle_venta dv ON dv.id_venta = vf.id_venta
       JOIN lote l ON l.id_lote = dv.id_lote
       JOIN producto p ON p.id_producto = l.id_producto
       GROUP BY p.id_producto, p.codigo, p.nombre_comercial, p.nombre_generico
       ORDER BY ${orden}, p.id_producto ASC
       LIMIT $4`,
      [id_sucursal || null, fecha_desde || null, fecha_hasta || null, limite],
    );

    return rows;
  }
}

module.exports = new ReporteDAO();
