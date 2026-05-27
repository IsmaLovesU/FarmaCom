import React from 'react';

export default function CasaTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container-low/60 border-b border-slate-100">
      <span className="col-span-1 text-xs font-extrabold uppercase tracking-widest text-slate-400">#</span>
      <span className="col-span-5 text-xs font-extrabold uppercase tracking-widest text-slate-400">Nombre</span>
      <span className="col-span-2 text-xs font-extrabold uppercase tracking-widest text-slate-400 text-center">Estado</span>
      <span className="col-span-5 text-xs font-extrabold uppercase tracking-widest text-slate-400 text-center">Acciones</span>
    </div>
  );
}
