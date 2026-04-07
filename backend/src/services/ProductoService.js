const productosMock = [
  {
    id_producto: 1,
    codigo: 'MED001',
    nombre_comercial: 'Paracetamol 500mg',
    nombre_generico: 'Acetaminofén',
    presentacion: 'Tabletas',
    categoria: 'Analgésico',
    precio_compra: 15.00,
    precio_venta: 25.00,
    stock: 150,
    proveedor: 'Farmacéutica XYZ',
  },
  {
    id_producto: 2,
    codigo: 'MED002',
    nombre_comercial: 'Ibuprofeno 400mg',
    nombre_generico: 'Ibuprofeno',
    presentacion: 'Tabletas',
    categoria: 'Antiinflamatorio',
    precio_compra: 20.00,
    precio_venta: 35.00,
    stock: 200,
    proveedor: 'Farmacéutica ABC',
  },
  {
    id_producto: 3,
    codigo: 'MED003',
    nombre_comercial: 'Amoxicilina 500mg',
    nombre_generico: 'Amoxicilina',
    presentacion: 'Cápsulas',
    categoria: 'Antibiótico',
    precio_compra: 30.00,
    precio_venta: 50.00,
    stock: 80,
    proveedor: 'Farmacéutica XYZ',
  },
  {
    id_producto: 4,
    codigo: 'MED004',
    nombre_comercial: 'Omeprazol 20mg',
    nombre_generico: 'Omeprazol',
    presentacion: 'Cápsulas',
    categoria: 'Gastroenterológico',
    precio_compra: 25.00,
    precio_venta: 40.00,
    stock: 120,
    proveedor: 'Farmacéutica DEF',
  },
  {
    id_producto: 5,
    codigo: 'MED005',
    nombre_comercial: 'Loratadina 10mg',
    nombre_generico: 'Loratadina',
    presentacion: 'Tabletas',
    categoria: 'Antihistamínico',
    precio_compra: 12.00,
    precio_venta: 22.00,
    stock: 95,
    proveedor: 'Farmacéutica ABC',
  },
];

const obtenerProductos = () => {
  return productosMock;
};

module.exports = { obtenerProductos };