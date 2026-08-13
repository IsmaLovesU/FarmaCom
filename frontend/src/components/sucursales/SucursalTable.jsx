import React from 'react';
import SucursalTableHeader from './SucursalTableHeader.jsx';
import SucursalTableRow from './SucursalTableRow.jsx';

export default function SucursalTable({
  cargando,
  sucursales,
  mapaCiudades,
  onEditar,
  onEliminar,
  onContactos,
  eliminandoId,
}) {
  return (
    <section className="bg-surface-container-low/60 border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[880px]">
          <SucursalTableHeader />

          {cargando ? (
            <div className="px-5 py-10 text-center text-slate-500 font-medium">Cargando sucursales...</div>
          ) : sucursales.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500 font-medium">
              No hay sucursales para mostrar.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {sucursales.map((sucursal) => (
                <SucursalTableRow
                  key={sucursal.id_sucursal}
                  sucursal={sucursal}
                  nombreCiudad={mapaCiudades[sucursal.id_ciudad] || `Ciudad #${sucursal.id_ciudad}`}
                  onEditar={onEditar}
                  onEliminar={onEliminar}
                  onContactos={onContactos}
                  eliminando={eliminandoId === sucursal.id_sucursal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
