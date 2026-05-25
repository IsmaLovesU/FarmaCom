import React, { useMemo } from 'react';
import { AlertCircle, Boxes, Loader2 } from 'lucide-react';
import EstadoBadge from './EstadoBadge.jsx';
import useLotesProducto from '../../../hooks/useLotesProducto.js';

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

export default function LotesDeProductoTable({ producto, sucursalId, activo }) {
  const { lotes, cargando, error } = useLotesProducto(producto.id_producto, { enabled: activo });

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
        <span className="col-span-2 text-right">Precio venta</span>
      </div>

      <div className="divide-y divide-slate-100">
        {lotesSucursal.map((lote) => (
          <div
            key={lote.id_lote}
            className="grid grid-cols-12 items-center gap-3 px-4 py-3 text-sm text-slate-600"
          >
            <div className="col-span-2 min-w-0">
              <p className="truncate font-bold text-slate-800">{lote.numero_lote}</p>
              <p className="truncate text-[11px] text-slate-400">{lote.presentacion_nombre}</p>
            </div>
            <span className="col-span-2 text-xs font-medium">
              {formatoFecha(lote.fecha_ingreso)}
            </span>
            <span className="col-span-2 text-xs font-medium">
              {formatoFecha(lote.fecha_vencimiento)}
            </span>
            <div className="col-span-2 text-right">
              <p className="font-black text-primary">{formatoNumero(lote.stock_actual)}</p>
              <p className="text-[10px] text-slate-400">base</p>
            </div>
            <div className="col-span-2 flex justify-center">
              <EstadoBadge estado={obtenerEstadoLote(lote)} />
            </div>
            <div className="col-span-2 text-right">
              <p className="font-bold text-slate-800">{formatoMoneda(lote.precio_venta)}</p>
              {lote.precio_mayoreo != null && (
                <p className="text-[10px] font-medium text-slate-400">
                  Mayoreo {formatoMoneda(lote.precio_mayoreo)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
