import React from 'react';

export default function SucursalTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 bg-surface-container-low">
      <span className="col-span-3">Sucursal</span>
      <span className="col-span-2">Ciudad</span>
      <span className="col-span-3">Direccion</span>
      <span className="col-span-4 text-center">Acciones</span>
    </div>
  );
}
