import React from 'react';
import CasaTableHeader from './CasaTableHeader.jsx';
import CasaTableRow from './CasaTableRow.jsx';

export default function CasaTable({ cargando, casas, onEditar, onCambiarEstado, onEliminar, procesandoId }) {
  if (cargando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 overflow-hidden">
        <CasaTableHeader />
        <div className="px-6 py-12 text-center text-sm text-slate-400">Cargando casas farmacéuticas...</div>
      </div>
    );
  }

  if (!casas.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 overflow-hidden">
        <CasaTableHeader />
        <div className="px-6 py-12 text-center text-sm text-slate-400">No se encontraron casas farmacéuticas.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 overflow-hidden">
      <CasaTableHeader />
      <div className="divide-y divide-slate-100">
        {casas.map((casa) => (
          <CasaTableRow
            key={casa.id_casa}
            casa={casa}
            onEditar={onEditar}
            onCambiarEstado={onCambiarEstado}
            onEliminar={onEliminar}
            procesando={procesandoId}
          />
        ))}
      </div>
    </div>
  );
}
