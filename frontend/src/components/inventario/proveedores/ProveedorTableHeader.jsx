import React from 'react';

export default function ProveedorTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 bg-surface-container-low">
      <span className="col-span-1">#</span>
      <span className="col-span-5">Nombre</span>
      <span className="col-span-2 text-center">Estado</span>
      <span className="col-span-4 text-center">Acciones</span>
    </div>
  );
}
