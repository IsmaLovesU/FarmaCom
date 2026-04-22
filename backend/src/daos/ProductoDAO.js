const pool = require('../database/db');

class ProductoDAO {
  async crear({ codigo, nombre_comercial, nombre_generico, presentacion, categoria, precio_compra, precio_venta, fecha_vencimiento }) {
    const query = `
      INSERT INTO producto (codigo, nombre_comercial, nombre_generico, presentacion, categoria, precio_compra, precio_venta, fecha_vencimiento)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [codigo, nombre_comercial, nombre_generico, presentacion, categoria, precio_compra, precio_venta, fecha_vencimiento || null]);
    return rows[0];
  }

  async obtenerTodos() {
    const query = `SELECT * FROM producto ORDER BY id_producto`;
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id_producto) {
    const { rows } = await pool.query(`SELECT * FROM producto WHERE id_producto = $1`, [id_producto]);
    return rows[0] || null;
  }

  async obtenerPorCodigo(codigo) {
    const { rows } = await pool.query(`SELECT * FROM producto WHERE LOWER(codigo) = LOWER($1)`, [codigo]);
    return rows[0] || null;
  }

  async actualizar(id_producto, campos) {
    const { codigo, nombre_comercial, nombre_generico, presentacion, categoria, precio_compra, precio_venta, fecha_vencimiento, activo } = campos;
    const query = `
      UPDATE producto SET
        codigo            = COALESCE($1, codigo),
        nombre_comercial  = COALESCE($2, nombre_comercial),
        nombre_generico   = COALESCE($3, nombre_generico),
        presentacion      = COALESCE($4, presentacion),
        categoria         = COALESCE($5, categoria),
        precio_compra     = COALESCE($6, precio_compra),
        precio_venta      = COALESCE($7, precio_venta),
        fecha_vencimiento = COALESCE($8, fecha_vencimiento),
        activo            = COALESCE($9, activo)
      WHERE id_producto = $10
      RETURNING *
    `;
    const { rows } = await pool.query(query, [codigo, nombre_comercial, nombre_generico, presentacion, categoria, precio_compra, precio_venta, fecha_vencimiento, activo, id_producto]);
    return rows[0] || null;
  }

  async eliminar(id_producto) {
    const { rows } = await pool.query(`DELETE FROM producto WHERE id_producto = $1 RETURNING *`, [id_producto]);
    return rows[0] || null;
  }
}

module.exports = new ProductoDAO();