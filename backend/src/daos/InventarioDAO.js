const pool = require('../database/db');

class InventarioDAO {
  async obtenerPorSucursal(id_sucursal) {
    const query = `
      SELECT i.*, p.codigo, p.nombre_comercial, p.nombre_generico,
             p.presentacion, p.categoria, p.precio_compra, p.precio_venta,
             p.fecha_vencimiento, p.activo
      FROM inventario_sucursal i
      JOIN producto p ON p.id_producto = i.id_producto
      WHERE i.id_sucursal = $1
      ORDER BY p.nombre_comercial
    `;
    const { rows } = await pool.query(query, [id_sucursal]);
    return rows;
  }

  async obtenerPorId(id_inventario) {
    const query = `
      SELECT i.*, p.codigo, p.nombre_comercial, p.nombre_generico,
             p.presentacion, p.categoria, p.precio_compra, p.precio_venta,
             p.fecha_vencimiento, p.activo
      FROM inventario_sucursal i
      JOIN producto p ON p.id_producto = i.id_producto
      WHERE i.id_inventario = $1
    `;
    const { rows } = await pool.query(query, [id_inventario]);
    return rows[0] || null;
  }

  async obtenerPorSucursalYProducto(id_sucursal, id_producto) {
    const { rows } = await pool.query(
      `SELECT * FROM inventario_sucursal WHERE id_sucursal=$1 AND id_producto=$2`,
      [id_sucursal, id_producto]
    );
    return rows[0] || null;
  }

  async crear({ id_sucursal, id_producto, stock, stock_minimo }) {
    const query = `
      INSERT INTO inventario_sucursal (id_sucursal, id_producto, stock, stock_minimo)
      VALUES ($1,$2,$3,$4) RETURNING *
    `;
    const { rows } = await pool.query(query, [id_sucursal, id_producto, stock ?? 0, stock_minimo ?? 5]);
    return rows[0];
  }

  async actualizarStock(id_inventario, stock) {
    const { rows } = await pool.query(
      `UPDATE inventario_sucursal SET stock=$1 WHERE id_inventario=$2 RETURNING *`,
      [stock, id_inventario]
    );
    return rows[0] || null;
  }

  async eliminar(id_inventario) {
    const { rows } = await pool.query(
      `DELETE FROM inventario_sucursal WHERE id_inventario=$1 RETURNING *`,
      [id_inventario]
    );
    return rows[0] || null;
  }
}

module.exports = new InventarioDAO();