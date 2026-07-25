import { describe, expect, it } from 'vitest';
import { construirCatalogoPOS, filtrarCatalogoPOS } from './pos';

const inventario = [
  {
    id_producto: 1,
    codigo: 'MED-001',
    nombre_comercial: 'Paracetamol',
    nombre_generico: 'Acetaminofén',
    activo: true,
  },
  {
    id_producto: 2,
    codigo: 'MED-002',
    nombre_comercial: 'Ibuprofeno',
    activo: false,
  },
];

describe('utilidades del punto de venta', () => {
  it('construye opciones vendibles y excluye lotes vencidos o sin stock', () => {
    const lotes = [
      {
        id_lote: 10,
        id_producto: 1,
        presentacion_ingreso: 5,
        presentacion_nombre: 'Blíster',
        factor_conversion: 10,
        stock_actual: 40,
        precio_venta: '8.50',
        numero_lote: 'L-001',
        estado_vencimiento: 'normal',
        estado_stock: 'normal',
      },
      {
        id_lote: 11,
        id_producto: 1,
        presentacion_ingreso: 6,
        presentacion_nombre: 'Caja',
        factor_conversion: 100,
        stock_actual: 0,
        precio_venta: '75.00',
        estado_vencimiento: 'normal',
      },
      {
        id_lote: 12,
        id_producto: 2,
        presentacion_ingreso: 7,
        factor_conversion: 1,
        stock_actual: 20,
        precio_venta: '2.00',
        estado_vencimiento: 'normal',
      },
    ];

    const resultado = construirCatalogoPOS(inventario, lotes);

    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toMatchObject({
      id_lote: 10,
      nombre_comercial: 'Paracetamol',
      presentacion_nombre: 'Blíster',
      stock_disponible: 4,
      precio_venta: 8.5,
      tiene_precio: true,
    });
  });

  it('no interpreta un precio nulo como un precio de cero', () => {
    const resultado = construirCatalogoPOS(inventario, [
      {
        id_lote: 10,
        id_producto: 1,
        presentacion_ingreso: 5,
        factor_conversion: 1,
        stock_actual: 5,
        precio_venta: null,
        estado_vencimiento: 'normal',
      },
    ]);

    expect(resultado[0].precio_venta).toBeNull();
    expect(resultado[0].tiene_precio).toBe(false);
  });

  it('filtra por código, nombre genérico o presentación', () => {
    const productos = [
      {
        codigo: 'MED-001',
        nombre_comercial: 'Paracetamol',
        nombre_generico: 'Acetaminofén',
        presentacion_nombre: 'Blíster',
      },
      {
        codigo: 'HIG-010',
        nombre_comercial: 'Pañales',
        presentacion_nombre: 'Paquete',
      },
    ];

    expect(filtrarCatalogoPOS(productos, 'MED-001')).toEqual([productos[0]]);
    expect(filtrarCatalogoPOS(productos, 'acetaminofén')).toEqual([productos[0]]);
    expect(filtrarCatalogoPOS(productos, 'paquete')).toEqual([productos[1]]);
  });
});
