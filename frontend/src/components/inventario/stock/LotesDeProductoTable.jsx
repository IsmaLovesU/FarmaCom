import React, { useMemo } from 'react';
import { AlertCircle, Boxes, Loader2, Pencil, Trash2 } from 'lucide-react';
import EstadoBadge from './EstadoBadge.jsx';
import useLotesProducto from '../../../hooks/useLotesProducto.js';
import { obtenerEtiquetaPresentacion, obtenerPluralPresentacion } from '../../../constants/presentaciones.js';

const formatoFecha = (valor) => {
  if (!valor) return '—';

  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(valor));
};

const formatoNumero = (valor, decimales = 4) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return '—';
  return Number.isInteger(numero)
    ? numero.toLocaleString('es-GT')
    : numero.toLocaleString('es-GT', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimales,
    });
};

const formatoMoneda = (valor) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return '—';
  return `Q${numero.toFixed(2)}`;
};

const obtenerEstadoLote = (lote) => {
  if (lote.estado_vencimiento && lote.estado_vencimiento !== 'normal') {
    return lote.estado_vencimiento;
  }

  if (lote.estado_stock && lote.estado_stock !== 'normal') {
    return lote.estado_stock;
  }

  return 'normal';
};

export default function LotesDeProductoTable({
  producto,
  sucursalId,
  activo,
  onEditar,
  onEliminar,
  refreshKey,
}) {
  const { lotes, cargando, error } = useLotesProducto(producto.id_producto, {
    enabled: activo,
    refreshKey,
  });
  const mostrarAcciones = Boolean(onEditar && onEliminar);

  const lotesSucursal = useMemo(
    () => lotes.filter((lote) => String(lote.id_sucursal) === String(sucursalId)),
    [lotes, sucursalId],
  );

  if (cargando) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/70 px-4 py-6 text-center">
        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-primary" />
        <p className="text-sm font-semibold text-slate-400">Cargando lotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-error/20 bg-error-container/30 px-4 py-3 text-sm font-semibold text-error">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  if (lotesSucursal.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-primary/20 p-6 text-center">
        <Boxes className="mx-auto mb-2 h-8 w-8 text-primary/20" />
        <p className="text-sm font-semibold text-slate-400">
          No hay lotes registrados para este producto en la sucursal actual.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/80">
      <div className="grid grid-cols-12 gap-3 border-b border-slate-100 bg-surface-container-low px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
        <span className="col-span-2">N° lote</span>
        <span className="col-span-2">Ingreso</span>
        <span className="col-span-2">Vencimiento</span>
        <span className="col-span-2 text-right">Stock</span>
        <span className="col-span-2 text-center">Estado</span>
        <span className={`${mostrarAcciones ? 'col-span-1' : 'col-span-2'} text-right`}>Precio</span>
        {mostrarAcciones && <span className="col-span-1 text-center">Acciones</span>}
      </div>

      <div className="divide-y divide-slate-100">
        {lotesSucursal.map((lote) => (
          <div
            key={lote.id_lote}
            className="grid grid-cols-12 items-center gap-3 px-4 py-3 text-sm text-slate-600"
          >
            <div className="col-span-2 min-w-0">
              <p className="truncate font-bold text-slate-800">{lote.numero_lote}</p>
              <p className="truncate text-[11px] text-slate-400">
                {obtenerEtiquetaPresentacion(lote.presentacion)}
              </p>
            </div>
            <span className="col-span-2 text-xs font-medium">
              {formatoFecha(lote.fecha_ingreso)}
            </span>
            <span className="col-span-2 text-xs font-medium">
              {formatoFecha(lote.fecha_vencimiento)}
            </span>
            <div className="col-span-2 text-right">
              <p className="font-black text-primary">{formatoNumero(lote.stock_actual)}</p>
              <p className="text-[10px] text-slate-400">{obtenerPluralPresentacion(lote.presentacion)}</p>
            </div>
            <div className="col-span-2 flex justify-center">
              <EstadoBadge estado={obtenerEstadoLote(lote)} />
            </div>
            <div className={`${mostrarAcciones ? 'col-span-1' : 'col-span-2'} text-right`}>
              <p className="font-bold text-slate-800">{formatoMoneda(lote.precio_venta)}</p>
              {lote.precio_mayoreo != null && (
                <p className="text-[10px] font-medium text-slate-400">
                  Mayoreo {formatoMoneda(lote.precio_mayoreo)}
                </p>
              )}
            </div>
            {mostrarAcciones && <div className="col-span-1 flex justify-center gap-1">
              <button
                type="button"
                onClick={() => onEditar(lote)}
                className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                title="Editar lote"
                aria-label={`Editar lote ${lote.numero_lote}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onEliminar(lote)}
                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                title="Eliminar lote"
                aria-label={`Eliminar lote ${lote.numero_lote}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>}
          </div>
        ))}
      </div>
    </div>
  );
}
