import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function CasaActionBar({ busqueda, onBusquedaChange, onCrear }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={busqueda}
          onChange={onBusquedaChange}
          placeholder="Buscar casa farmacéutica..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>
      <button
        onClick={onCrear}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nueva casa
      </button>
    </div>
  );
}
