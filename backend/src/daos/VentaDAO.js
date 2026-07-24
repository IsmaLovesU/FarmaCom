const pool = require('../database/db');

class VentaDAO {
  async insertarDetalles(cliente, id_venta, detalles) {
    for (const detalle of detalles) {
      await cliente.query(
        `INSERT INTO detalle_venta (
          id_venta, descripcion, cantidad, precio_unitario
        )
        VALUES ($1, $2, $3, $4)`,
        [
          id_venta,
          detalle.descripcion,
          detalle.cantidad,
          detalle.precio_unitario,
        ],
      );
    }
  }

  async recalcularTotal(cliente, id_venta) {
    await cliente.query(
      `UPDATE venta
       SET total = (
         SELECT COALESCE(SUM(subtotal), 0)
         FROM detalle_venta
         WHERE id_venta = $1
       ),
       fecha_actualizacion = NOW()
       WHERE id_venta = $1`,
      [id_venta],
    );
  }

  async crear({ id_sucursal, id_usuario, observaciones, detalles }) {
    const cliente = await pool.connect();

    try {
      await cliente.query('BEGIN');

      const { rows } = await cliente.query(
        `INSERT INTO venta (id_sucursal, id_usuario, observaciones)
         VALUES ($1, $2, $3)
         RETURNING id_venta`,
        [id_sucursal, id_usuario, observaciones ?? null],
      );

      const id_venta = rows[0].id_venta;
      await this.insertarDetalles(cliente, id_venta, detalles);
      await this.recalcularTotal(cliente, id_venta);
      await cliente.query('COMMIT');

      return await this.obtenerPorId(id_venta, id_sucursal);
    } catch (error) {
      await cliente.query('ROLLBACK');
      throw error;
    } finally {
      cliente.release();
    }
  }

  async obtenerTodas(id_sucursal) {
    const { rows } = await pool.query(
      `SELECT
         v.*,
         u.nombre_usuario,
         COUNT(dv.id_detalle)::INTEGER AS cantidad_detalles
       FROM venta v
       JOIN usuario u ON u.id_usuario = v.id_usuario
       LEFT JOIN detalle_venta dv ON dv.id_venta = v.id_venta
       WHERE v.id_sucursal = $1
       GROUP BY v.id_venta, u.nombre_usuario
       ORDER BY v.fecha_creacion DESC, v.id_venta DESC`,
      [id_sucursal],
    );
    return rows;
  }

  async obtenerPorId(id_venta, id_sucursal) {
    const { rows } = await pool.query(
      `SELECT v.*, u.nombre_usuario
       FROM venta v
       JOIN usuario u ON u.id_usuario = v.id_usuario
       WHERE v.id_venta = $1 AND v.id_sucursal = $2`,
      [id_venta, id_sucursal],
    );

    if (!rows[0]) return null;

    const { rows: detalles } = await pool.query(
      `SELECT *
       FROM detalle_venta
       WHERE id_venta = $1
       ORDER BY id_detalle`,
      [id_venta],
    );

    return { ...rows[0], detalles };
  }

  async actualizar(id_venta, id_sucursal, campos) {
    const cliente = await pool.connect();

    try {
      await cliente.query('BEGIN');

      const { rows } = await cliente.query(
        `SELECT id_venta
         FROM venta
         WHERE id_venta = $1 AND id_sucursal = $2
         FOR UPDATE`,
        [id_venta, id_sucursal],
      );

      if (!rows[0]) {
        await cliente.query('ROLLBACK');
        return null;
      }

      const incluyeObservaciones = Object.prototype.hasOwnProperty.call(
        campos,
        'observaciones',
      );

      await cliente.query(
        `UPDATE venta
         SET observaciones = CASE WHEN $1 THEN $2 ELSE observaciones END,
             fecha_actualizacion = NOW()
         WHERE id_venta = $3`,
        [incluyeObservaciones, campos.observaciones ?? null, id_venta],
      );

      if (campos.detalles !== undefined) {
        await cliente.query(
          'DELETE FROM detalle_venta WHERE id_venta = $1',
          [id_venta],
        );
        await this.insertarDetalles(cliente, id_venta, campos.detalles);
        await this.recalcularTotal(cliente, id_venta);
      }

      await cliente.query('COMMIT');
      return await this.obtenerPorId(id_venta, id_sucursal);
    } catch (error) {
      await cliente.query('ROLLBACK');
      throw error;
    } finally {
      cliente.release();
    }
  }

  async eliminar(id_venta, id_sucursal) {
    const { rows } = await pool.query(
      `DELETE FROM venta
       WHERE id_venta = $1
         AND id_sucursal = $2
         AND estado = 'borrador'
       RETURNING id_venta`,
      [id_venta, id_sucursal],
    );
    return rows[0] || null;
  }
}

module.exports = new VentaDAO();
