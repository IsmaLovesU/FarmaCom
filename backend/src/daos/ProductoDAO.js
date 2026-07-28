const pool = require('../database/db');

class ProductoDAO {

  async crear({ codigo, nombre_comercial, nombre_generico, concentracion, presentacion, descripcion, id_categoria, id_casa, id_proveedor, precio_compra, stock_minimo, meses_alerta_vencimiento, aplica_mayoreo }) {
    const query = `
      INSERT INTO producto (
        codigo, nombre_comercial, nombre_generico, concentracion, presentacion, descripcion,
        id_categoria, id_casa, id_proveedor,
        precio_compra, stock_minimo, meses_alerta_vencimiento, aplica_mayoreo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const valores = [
      codigo,
      nombre_comercial,
      nombre_generico,
      concentracion,
      presentacion,
      descripcion                  ?? null,
      id_categoria,
      id_casa,
      id_proveedor                 ?? null,
      precio_compra,
      stock_minimo                 ?? 5,
      meses_alerta_vencimiento,
      aplica_mayoreo               ?? false,
    ];
    
    const { rows } = await pool.query(query, valores);
    return rows[0];
  }

  async obtenerTodos() {
    const query = `
      SELECT
        p.*,
        c.nombre   AS categoria_nombre,
        cf.nombre  AS casa_nombre,
        pr.nombre  AS proveedor_nombre
      FROM producto p
      JOIN categoria         c  ON c.id_categoria  = p.id_categoria
      JOIN casa_farmaceutica cf ON cf.id_casa       = p.id_casa
      LEFT JOIN proveedor    pr ON pr.id_proveedor  = p.id_proveedor
      ORDER BY p.id_producto
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id_producto) {
    const query = `
      SELECT
        p.*,
        c.nombre   AS categoria_nombre,
        cf.nombre  AS casa_nombre,
        pr.nombre  AS proveedor_nombre
      FROM producto p
      JOIN categoria         c  ON c.id_categoria  = p.id_categoria
      JOIN casa_farmaceutica cf ON cf.id_casa       = p.id_casa
      LEFT JOIN proveedor    pr ON pr.id_proveedor  = p.id_proveedor
      WHERE p.id_producto = $1
    `;
    const { rows } = await pool.query(query, [id_producto]);
    return rows[0] || null;
  }

  async obtenerPorCodigo(codigo) {
    const { rows } = await pool.query(
      `SELECT * FROM producto WHERE LOWER(codigo) = LOWER($1)`,
      [codigo],
    );
    return rows[0] || null;
  }

   async obtenerPorIdentidad({ nombre_generico, concentracion, id_casa, presentacion }) {
    const query = `
      SELECT *
      FROM producto
      WHERE LOWER(TRIM(nombre_generico)) = LOWER(TRIM($1))
        AND LOWER(TRIM(concentracion))   = LOWER(TRIM($2))
        AND id_casa                      = $3
        AND presentacion                 = $4
    `;
    const { rows } = await pool.query(query, [nombre_generico, concentracion, id_casa, presentacion]);
    return rows[0] || null;
  }

  async actualizar(id_producto, campos) {
    const {
      codigo, nombre_comercial, nombre_generico, concentracion, presentacion, descripcion,
      id_categoria, id_casa, id_proveedor,
      precio_compra, stock_minimo, meses_alerta_vencimiento, aplica_mayoreo,
    } = campos;

    const query = `
      UPDATE producto SET
        codigo                   = COALESCE($1,  codigo),
        nombre_comercial         = COALESCE($2,  nombre_comercial),
        nombre_generico          = COALESCE($3,  nombre_generico),
        concentracion            = COALESCE($4,  concentracion),
        presentacion             = COALESCE($5,  presentacion),
        descripcion              = COALESCE($6,  descripcion),
        id_categoria             = COALESCE($7,  id_categoria),
        id_casa                  = COALESCE($8,  id_casa),
        id_proveedor             = COALESCE($9,  id_proveedor),
        precio_compra            = COALESCE($10, precio_compra),
        stock_minimo             = COALESCE($11, stock_minimo),
        meses_alerta_vencimiento = COALESCE($12, meses_alerta_vencimiento),
        aplica_mayoreo           = COALESCE($13, aplica_mayoreo)
      WHERE id_producto = $14
      RETURNING *
    `;
    const valores = [
      codigo                   ?? null,
      nombre_comercial         ?? null,
      nombre_generico          ?? null,
      concentracion            ?? null,
      presentacion             ?? null,
      descripcion              ?? null,
      id_categoria             ?? null,
      id_casa                  ?? null,
      id_proveedor             ?? null,
      precio_compra            ?? null,
      stock_minimo             ?? null,
      meses_alerta_vencimiento ?? null,
      aplica_mayoreo           ?? null,
      id_producto,
    ];

    const { rows } = await pool.query(query, valores);
    return rows[0] || null;
  }

  // Solo el dependiente puede togglear este campo
  async cambiarAplicaMayoreo(id_producto, aplica_mayoreo) {
    const { rows } = await pool.query(
      `UPDATE producto SET aplica_mayoreo = $1 WHERE id_producto = $2 RETURNING *`,
      [aplica_mayoreo, id_producto],
    );
    return rows[0] || null;
  }

  async cambiarActivo(id_producto, activo) {
    const { rows } = await pool.query(
      `UPDATE producto SET activo = $1 WHERE id_producto = $2 RETURNING *`,
      [activo, id_producto],
    );
    return rows[0] || null;
  }
}

module.exports = new ProductoDAO();
