import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function SucursalTable({
  cargando,
  sucursales,
  mapaCiudades,
  onEditar,
  onEliminar,
  eliminandoId,
}) {
  return (
    <section className="bg-surface-container-low/60 border border-slate-200 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 bg-surface-container-low">
        <span className="col-span-4">Sucursal</span>
        <span className="col-span-3">Ciudad</span>
        <span className="col-span-4">Direccion</span>
        <span className="col-span-1 text-right">Acciones</span>
      </div>

      {cargando ? (
        <div className="px-5 py-10 text-center text-slate-500 font-medium">Cargando sucursales...</div>
      ) : sucursales.length === 0 ? (
        <div className="px-5 py-10 text-center text-slate-500 font-medium">
          No hay sucursales para mostrar.
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {sucursales.map((sucursal) => (
            <div key={sucursal.id_sucursal} className="grid grid-cols-12 gap-4 px-5 py-4 items-center bg-white/60">
              <span className="col-span-4 font-semibold text-primary">{sucursal.nombre_sucursal}</span>
              <span className="col-span-3 text-slate-700">{mapaCiudades[sucursal.id_ciudad] || `Ciudad #${sucursal.id_ciudad}`}</span>
              <span className="col-span-4 text-slate-700">{sucursal.direccion}</span>
              <div className="col-span-1 flex justify-end">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditar(sucursal)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(sucursal)}
                    disabled={eliminandoId === sucursal.id_sucursal}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {eliminandoId === sucursal.id_sucursal ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
