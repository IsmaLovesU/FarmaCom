jest.mock('../database/db');

const pool = require('../database/db');
const ProductoDAO = require('./ProductoDAO');

describe('ProductoDAO - concentración opcional', () => {
  beforeEach(() => jest.clearAllMocks());

  it('compara concentraciones nulas como parte de la identidad', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await ProductoDAO.obtenerPorIdentidad({
      nombre_generico: 'Termómetro',
      concentracion: null,
      id_casa: 2,
      id_presentacion: 3,
    });

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("COALESCE(LOWER(TRIM(concentracion)), '')"),
      ['Termómetro', null, 2, 3],
    );
  });

  it('permite establecer explícitamente la concentración en null', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_producto: 7, concentracion: null }] });

    await ProductoDAO.actualizar(7, { concentracion: null });

    const [consulta, valores] = pool.query.mock.calls[0];
    expect(consulta).toContain('concentracion            = CASE WHEN $14 THEN $4 ELSE concentracion END');
    expect(consulta).toContain('WHERE id_producto = $15');
    expect(valores[3]).toBeNull();
    expect(valores[13]).toBe(true);
    expect(valores[14]).toBe(7);
  });

  it('no modifica la concentración cuando el campo se omite', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_producto: 7, concentracion: '500 mg' }] });

    await ProductoDAO.actualizar(7, { nombre_comercial: 'Producto actualizado' });

    const valores = pool.query.mock.calls[0][1];
    expect(valores[13]).toBe(false);
  });
});

describe('ProductoDAO - autocompletado para POS', () => {
  beforeEach(() => jest.clearAllMocks());

  it('filtra productos y selecciona un lote vendible de la sucursal', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_producto: 3, id_lote: 9 }] });

    const resultado = await ProductoDAO.autocompletarParaPOS('Pará_50%', 2, 8);

    const [consulta, valores] = pool.query.mock.calls[0];
    expect(consulta).toContain('p.activo = TRUE');
    expect(consulta).toContain('l.id_sucursal = $2');
    expect(consulta).toContain('l.stock_actual > 0');
    expect(consulta).toContain('l.precio_venta > 0');
    expect(consulta).toContain('l.fecha_vencimiento >= CURRENT_DATE');
    expect(consulta).toContain('FROM v_lote_estado l');
    expect(consulta).toContain('lote_pos.estado_vencimiento');
    expect(consulta).toContain('ORDER BY l.fecha_vencimiento ASC');
    expect(valores).toEqual(['Pará_50%', 2, 8, 'Pará\\_50\\%']);
    expect(resultado).toEqual([{ id_producto: 3, id_lote: 9 }]);
  });
});
