import React from 'react';
import {
  Banknote,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  WalletCards,
} from 'lucide-react';
import { formatearMoneda, formatearNumero } from '../../utils/reportes';

const METRICAS = [
  {
    clave: 'ingresos_totales',
    etiqueta: 'Ingresos totales',
    icono: Banknote,
    formatear: formatearMoneda,
    tono: 'bg-primary/10 text-primary',
  },
  {
    clave: 'total_ventas',
    etiqueta: 'Ventas',
    icono: ReceiptText,
    formatear: formatearNumero,
    tono: 'bg-sky-100 text-sky-700',
  },
  {
    clave: 'ticket_promedio',
    etiqueta: 'Ticket promedio',
    icono: WalletCards,
    formatear: formatearMoneda,
    tono: 'bg-amber-100 text-amber-700',
  },
  {
    clave: 'unidades_vendidas',
    etiqueta: 'Unidades vendidas',
    icono: PackageCheck,
    formatear: formatearNumero,
    tono: 'bg-emerald-100 text-emerald-700',
  },
];

function MetricaSkeleton({ etiqueta }) {
  return (
    <div
      aria-label={`Cargando ${etiqueta.toLowerCase()}`}
      className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <div className="h-10 w-10 rounded-xl bg-slate-100" />
      <div className="mt-5 h-7 w-2/3 rounded bg-slate-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
    </div>
  );
}

export default function ResumenVentasGrid({ datos, cargando, error, onReintentar }) {
  if (error) {
    return (
      <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-error/20 bg-error-container/30 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-on-error-container">{error}</p>
        <button
          type="button"
          onClick={onReintentar}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-error shadow-sm transition hover:bg-error-container/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/20"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="titulo-resumen-ventas" className="space-y-3">
      <h2 id="titulo-resumen-ventas" className="font-headline text-lg font-extrabold text-on-surface">
        Resumen
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICAS.map(({ clave, etiqueta, icono: Icono, formatear, tono }) => (
          cargando ? (
            <MetricaSkeleton key={clave} etiqueta={etiqueta} />
          ) : (
            <article
              key={clave}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tono}`}>
                <Icono className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-4 font-headline text-2xl font-extrabold tracking-tight text-primary">
                {formatear(datos?.[clave])}
              </p>
              <h3 className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                {etiqueta}
              </h3>
            </article>
          )
        ))}
      </div>
    </section>
  );
}
