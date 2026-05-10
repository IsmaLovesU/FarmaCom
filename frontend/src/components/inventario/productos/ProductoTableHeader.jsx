import React from 'react';

export default function ProductoTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 bg-surface-container-low">
      <span className="col-span-1">Código</span>
      <span className="col-span-3">Producto</span>
      <span className="col-span-2">Categoría / Casa</span>
      <span className="col-span-2">Proveedor</span>
      <span className="col-span-1 text-right">P. Compra</span>
      <span className="col-span-1 text-center">Stock Mín.</span>
      <span className="col-span-1 text-center">Estado</span>
      <span className="col-span-1 text-center">Acciones</span>
    </div>
  );
}