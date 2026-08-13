import React from 'react';
import UsuarioTableHeader from './UsuarioTableHeader.jsx';
import UsuarioTableRow from './UsuarioTableRow.jsx';

export default function UsuarioTable({
  cargando,
  usuarios,
  mapaSucursales,
  onEditar,
  onCambiarEstado,
  cambiandoEstadoId,
}) {
  return (
    <section className="bg-surface-container-low/60 border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[880px]">
          <UsuarioTableHeader />

          {cargando ? (
            <div className="px-5 py-10 text-center text-slate-500 font-medium">Cargando usuarios...</div>
          ) : usuarios.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500 font-medium">
              No hay usuarios para mostrar.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {usuarios.map((usuario) => (
                <UsuarioTableRow
                  key={usuario.id_usuario}
                  usuario={usuario}
                  nombreSucursal={mapaSucursales[usuario.id_sucursal] || `Sucursal #${usuario.id_sucursal}`}
                  onEditar={onEditar}
                  onCambiarEstado={onCambiarEstado}
                  cambiandoEstado={cambiandoEstadoId === usuario.id_usuario}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
