const pool = require('../database/db');

class ContactoSucursalDAO {
  async obtenerPorSucursal(id_sucursal) {
    const [{ rows: telefonos }, { rows: correos }] = await Promise.all([
      pool.query('SELECT * FROM telefono_sucursal WHERE id_sucursal = $1 ORDER BY id_telefono', [id_sucursal]),
      pool.query('SELECT * FROM correo_sucursal WHERE id_sucursal = $1 ORDER BY id_correo', [id_sucursal]),
    ]);
    return { telefonos, correos };
  }

  async agregarTelefono(id_sucursal, numero) {
    const { rows } = await pool.query(
      'INSERT INTO telefono_sucursal (id_sucursal, numero) VALUES ($1, $2) RETURNING *',
      [id_sucursal, numero],
    );
    return rows[0];
  }

  async eliminarTelefono(id_telefono, id_sucursal) {
    const { rows } = await pool.query(
      'DELETE FROM telefono_sucursal WHERE id_telefono = $1 AND id_sucursal = $2 RETURNING *',
      [id_telefono, id_sucursal],
    );
    return rows[0] || null;
  }

  async agregarCorreo(id_sucursal, correo) {
    const { rows } = await pool.query(
      'INSERT INTO correo_sucursal (id_sucursal, correo) VALUES ($1, $2) RETURNING *',
      [id_sucursal, correo],
    );
    return rows[0];
  }

  async eliminarCorreo(id_correo, id_sucursal) {
    const { rows } = await pool.query(
      'DELETE FROM correo_sucursal WHERE id_correo = $1 AND id_sucursal = $2 RETURNING *',
      [id_correo, id_sucursal],
    );
    return rows[0] || null;
  }
}

module.exports = new ContactoSucursalDAO();
