import React from 'react';
import { Pencil, Trash2, Phone } from 'lucide-react';

export default function SucursalTableRow({
  sucursal,
  nombreCiudad,
  onEditar,
  onEliminar,
  onContactos,
  eliminando,
}) {
  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center bg-white/60">
      <span className="col-span-3 font-semibold text-primary">{sucursal.nombre_sucursal}</span>
      <span className="col-span-2 text-slate-700">{nombreCiudad}</span>
      <span className="col-span-3 text-slate-700 text-sm">{sucursal.direccion}</span>
      <div className="col-span-4 flex justify-center gap-2">
        <button
          onClick={() => onContactos(sucursal)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-teal-700 border border-teal-200 hover:bg-teal-50"
        >
          <Phone className="w-3.5 h-3.5" />
          Contactos
        </button>
        <button
          onClick={() => onEditar(sucursal)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          onClick={() => onEliminar(sucursal)}
          disabled={eliminando}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {eliminando ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}
