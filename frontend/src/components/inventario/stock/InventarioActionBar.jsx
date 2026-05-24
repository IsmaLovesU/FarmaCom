import React from 'react';
import { Search, PlusCircle, ChevronDown, Store } from 'lucide-react';
import { motion } from 'motion/react';

const OPCIONES_DETALLE = {
  default: [
    { value: '', label: 'Sin detalle extra' },
    { value: 'poco_stock', label: 'Poco stock' },
  ],
  total: [
    { value: '', label: 'Sin detalle extra' },
    { value: 'poco_stock', label: 'Poco stock' },
  ],
  criticos: [
    { value: '', label: 'Todos los criticos' },
    { value: 'vencido', label: 'Solo vencidos' },
    { value: 'agotado', label: 'Solo agotados' },
  ],
};

export default function InventarioActionBar({
  busqueda,
  onBusquedaChange,
  filtroDetalle,
  onFiltroDetalleChange,
  tarjetaActiva,
  filtroCategoria,
  onFiltroCategoriaChange,
  categorias = [],
  sucursalId,
  sucursales = [],
  onSucursalChange,
  onNuevoLote,
}) {
  const mostrarFiltroDetalle = !tarjetaActiva || tarjetaActiva === 'total' || tarjetaActiva === 'criticos';
  const opcionesDetalle = OPCIONES_DETALLE[tarjetaActiva ?? 'default'] ?? OPCIONES_DETALLE.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-3"
    >
      <div className="flex flex-col items-center gap-3 md:flex-row">
        <div className="group relative w-full flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Buscar por nombre comercial, genérico o código..."
            value={busqueda}
            onChange={onBusquedaChange}
            className="w-full rounded-xl border border-slate-200 bg-surface-container-lowest py-3 pr-4 pl-12 text-sm font-medium placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          onClick={onNuevoLote}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-br from-primary to-primary-container px-6 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(0,81,71,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,81,71,0.3)] active:translate-y-0 md:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Ingresar Lote
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200/60 bg-surface-container-low p-4">
        {sucursales.length > 1 && (
          <div className="min-w-[200px] flex-1">
            <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Sucursal
            </label>
            <div className="relative">
              <Store className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" />
              <select
                value={sucursalId ?? ''}
                onChange={(e) => onSucursalChange(Number(e.target.value))}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-surface-container-lowest py-2.5 pr-9 pl-9 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sucursales.map((s) => (
                  <option key={s.id_sucursal} value={s.id_sucursal}>
                    {s.nombre_sucursal}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        )}

        {mostrarFiltroDetalle && (
          <div className="min-w-[180px] flex-1">
            <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Detalle
            </label>
            <div className="relative">
              <select
                value={filtroDetalle}
                onChange={(e) => onFiltroDetalleChange(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-surface-container-lowest py-2.5 pr-9 px-3 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              >
                {opcionesDetalle.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        )}

        <div className="min-w-[180px] flex-1">
          <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Categoria
          </label>
          <div className="relative">
            <select
              value={filtroCategoria}
              onChange={(e) => onFiltroCategoriaChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-surface-container-lowest py-2.5 pr-9 px-3 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todas las categorias</option>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
