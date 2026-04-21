import React from 'react';

export default function UsuarioTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 bg-surface-container-low">
      <span className="col-span-2">Nombre</span>
      <span className="col-span-3">Correo</span>
      <span className="col-span-2">Rol</span>
      <span className="col-span-2">Sucursal</span>
      <span className="col-span-1">Estado</span>
      <span className="col-span-2 text-right">Acciones</span>
    </div>
  );
}
