import React from 'react';
import { Pencil, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

export default function CasaTableRow({ casa, onEditar, onCambiarEstado, onEliminar, procesando }) {
  const esActivo = casa.activo;

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white/60 hover:bg-surface-container-low/40 transition-colors group">
      <span className="col-span-1 font-mono text-xs text-slate-400">{casa.id_casa}</span>

      <span className="col-span-5 font-semibold text-primary truncate">{casa.nombre}</span>

      <div className="col-span-2 flex justify-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          esActivo
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-600 border border-red-200'
        }`}>
          {esActivo ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      <div className="col-span-4 flex justify-center gap-1.5">
        <button
          onClick={() => onEditar(casa)}
          title="Editar"
          className="p-1.5 rounded-lg text-slate-500 hover:bg-surface-container-high hover:text-primary transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onCambiarEstado(casa)}
          disabled={procesando === casa.id_casa}
          title={esActivo ? 'Desactivar' : 'Activar'}
          className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
            esActivo
              ? 'text-slate-500 hover:bg-red-50 hover:text-red-600'
              : 'text-slate-500 hover:bg-green-50 hover:text-green-700'
          }`}
        >
          {esActivo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onEliminar(casa)}
          title="Eliminar"
          className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
