import React from 'react';
import CategoriaTableHeader from './CategoriaTableHeader.jsx';
import CategoriaTableRow from './CategoriaTableRow.jsx';

export default function CategoriaTable({ cargando, categorias, onEditar, onEliminar, eliminandoId }) {
  return (
    <section className="bg-surface-container-low/60 border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <CategoriaTableHeader />
          {cargando ? (
            <div className="px-5 py-10 text-center text-slate-500 font-medium">Cargando categorías...</div>
          ) : categorias.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500 font-medium">No hay categorías para mostrar.</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {categorias.map((cat) => (
                <CategoriaTableRow
                  key={cat.id_categoria}
                  categoria={cat}
                  onEditar={onEditar}
                  onEliminar={onEliminar}
                  eliminando={eliminandoId === cat.id_categoria}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
