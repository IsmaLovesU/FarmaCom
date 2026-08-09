jest.mock('../database/db');

const pool = require('../database/db');
const InventarioDAO = require('./InventarioDAO');

const normalizarConsulta = (consulta) => consulta.replace(/\s+/g, ' ').trim();

describe('InventarioDAO', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  describe('obtenerPorSucursal', () => {
    it('marca el producto como agotado solo cuando su stock total es cero', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await InventarioDAO.obtenerPorSucursal(3);

      const consulta = normalizarConsulta(pool.query.mock.calls[0][0]);
      expect(consulta).toContain(
        "WHEN COALESCE(SUM(v.stock_actual), 0) = 0 THEN 'agotado'",
      );
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [3]);
    });
  });

  describe('obtenerResumenPorSucursal', () => {
    it('clasifica como crítico por agotamiento según el stock total del producto', async () => {
      const resumen = {
        total_productos: '1',
        productos_criticos: '0',
        productos_proximos_vencer: '0',
        productos_optimos: '1',
      };
      pool.query.mockResolvedValue({ rows: [resumen] });

      const resultado = await InventarioDAO.obtenerResumenPorSucursal(3);

      const consulta = normalizarConsulta(pool.query.mock.calls[0][0]);
      expect(consulta).toContain('COALESCE(SUM(v.stock_actual), 0) AS stock_total');
      expect(consulta).toContain('WHERE tiene_vencidos OR stock_total = 0');
      expect(resultado).toEqual(resumen);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [3]);
    });
  });
});
