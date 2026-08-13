import React from 'react';
import CasaTableHeader from './CasaTableHeader.jsx';
import CasaTableRow from './CasaTableRow.jsx';

export default function CasaTable({ cargando, casas, onEditar, onCambiarEstado, onContactos, onEliminar, procesandoId }) {
  return (
    <section className="bg-surface-container-low/60 border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <CasaTableHeader />
          {cargando ? (
            <div className="px-5 py-10 text-center text-slate-500 font-medium">Cargando casas farmacéuticas...</div>
          ) : casas.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500 font-medium">No hay casas farmacéuticas para mostrar.</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {casas.map((casa) => (
                <CasaTableRow
                  key={casa.id_casa}
                  casa={casa}
                  onEditar={onEditar}
                  onCambiarEstado={onCambiarEstado}
                  onContactos={onContactos}
                  onEliminar={onEliminar}
                  procesando={procesandoId === casa.id_casa}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
