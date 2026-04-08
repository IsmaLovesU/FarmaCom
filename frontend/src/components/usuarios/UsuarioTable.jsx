import React from 'react';
import { Pencil, UserX, UserCheck } from 'lucide-react';

const ETIQUETAS_ROL = {
  dueno: 'Dueño',
  administrador: 'Administrador',
  dependiente: 'Dependiente',
};

const ESTILOS_ESTADO = {
  activo: 'bg-green-100 text-green-700 border border-green-200',
  inactivo: 'bg-red-100 text-red-700 border border-red-200',
  suspendido: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
};

const ETIQUETAS_ESTADO = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  suspendido: 'Suspendido',
};

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
      <div className="grid grid-cols-12 gap-4 px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 bg-surface-container-low">
        <span className="col-span-3">Nombre</span>
        <span className="col-span-3">Correo</span>
        <span className="col-span-2">Rol</span>
        <span className="col-span-2">Sucursal</span>
        <span className="col-span-1">Estado</span>
        <span className="col-span-1 text-right">Acciones</span>
      </div>

      {cargando ? (
        <div className="px-5 py-10 text-center text-slate-500 font-medium">Cargando usuarios...</div>
      ) : usuarios.length === 0 ? (
        <div className="px-5 py-10 text-center text-slate-500 font-medium">
          No hay usuarios para mostrar.
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {usuarios.map((usuario) => {
            const esActivo = usuario.estado_usuario === 'activo';
            return (
              <div
                key={usuario.id_usuario}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center bg-white/60"
              >
                <span className="col-span-3 font-semibold text-primary truncate">
                  {usuario.nombre_usuario}
                </span>
                <span className="col-span-3 text-slate-700 truncate text-sm">
                  {usuario.correo_usuario}
                </span>
                <span className="col-span-2 text-slate-700 text-sm">
                  {ETIQUETAS_ROL[usuario.rol] || usuario.rol}
                </span>
                <span className="col-span-2 text-slate-700 text-sm">
                  {mapaSucursales[usuario.id_sucursal] || `Sucursal #${usuario.id_sucursal}`}
                </span>
                <span className="col-span-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      ESTILOS_ESTADO[usuario.estado_usuario] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ETIQUETAS_ESTADO[usuario.estado_usuario] || usuario.estado_usuario}
                  </span>
                </span>
                <div className="col-span-1 flex justify-end">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditar(usuario)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => onCambiarEstado(usuario)}
                      disabled={cambiandoEstadoId === usuario.id_usuario}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold border disabled:opacity-60 ${
                        esActivo
                          ? 'text-red-600 border-red-200 hover:bg-red-50'
                          : 'text-green-700 border-green-200 hover:bg-green-50'
                      }`}
                    >
                      {esActivo ? (
                        <UserX className="w-3.5 h-3.5" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5" />
                      )}
                      {cambiandoEstadoId === usuario.id_usuario
                        ? 'Guardando...'
                        : esActivo
                        ? 'Desactivar'
                        : 'Activar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
