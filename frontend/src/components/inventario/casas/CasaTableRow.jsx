import React from 'react';
import { Pencil, ToggleLeft, ToggleRight, Trash2, Phone } from 'lucide-react';

export default function CasaTableRow({ casa, onEditar, onCambiarEstado, onContactos, onEliminar, procesando }) {
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

      <div className="col-span-5 flex justify-center gap-1.5 flex-wrap">
        <button
          onClick={() => onContactos(casa)}
          title="Contactos y proveedores"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-teal-700 border border-teal-200 hover:bg-teal-50 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Contactos
        </button>
        <button
          onClick={() => onEditar(casa)}
          title="Editar nombre"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          onClick={() => onCambiarEstado(casa)}
          disabled={procesando === casa.id_casa}
          title={esActivo ? 'Desactivar' : 'Activar'}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-50 ${
            esActivo
              ? 'text-red-600 border-red-200 hover:bg-red-50'
              : 'text-green-700 border-green-200 hover:bg-green-50'
          }`}
        >
          {esActivo
            ? <><ToggleRight className="w-3.5 h-3.5" /> Desactivar</>
            : <><ToggleLeft className="w-3.5 h-3.5" /> Activar</>}
        </button>
        <button
          onClick={() => onEliminar(casa)}
          title="Eliminar"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
