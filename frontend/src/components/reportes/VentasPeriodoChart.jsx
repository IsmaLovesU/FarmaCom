import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  formatearFechaReporte,
  formatearMoneda,
  formatearNumero,
  formatearPeriodoReporte,
} from '../../utils/reportes';

const ETIQUETAS_AGRUPACION = {
  dia: 'Por día',
  semana: 'Por semana',
  mes: 'Por mes',
};

const formatearEjeMoneda = (valor) => {
  const monto = Number(valor) || 0;
  if (monto >= 1000000) return `Q${(monto / 1000000).toFixed(1)}M`;
  if (monto >= 1000) return `Q${(monto / 1000).toFixed(1)}K`;
  return `Q${monto}`;
};

function TooltipVentas({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const periodo = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      <p className="text-xs font-bold text-slate-500">{formatearFechaReporte(label)}</p>
      <p className="mt-1 font-headline text-base font-extrabold text-primary">
        {formatearMoneda(periodo.ingresos)}
      </p>
      <p className="mt-1 text-xs text-on-surface-variant">
        {formatearNumero(periodo.total_ventas)} ventas ·{' '}
        {formatearNumero(periodo.unidades_vendidas)} unidades
      </p>
    </div>
  );
}

export default function VentasPeriodoChart({
  datos,
  agrupacion,
  cargando,
  error,
  onReintentar,
}) {
  const hayVentas = datos?.some((periodo) => periodo.ingresos > 0);

  return (
    <section
      aria-labelledby="titulo-ventas-periodo"
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="titulo-ventas-periodo" className="font-headline text-lg font-extrabold text-on-surface">
            Ingresos por período
          </h2>
        </div>
        <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-bold text-primary">
          {ETIQUETAS_AGRUPACION[agrupacion] || ETIQUETAS_AGRUPACION.dia}
        </span>
      </div>

      {cargando && (
        <div aria-label="Cargando gráfica de ingresos" className="mt-5 h-80 animate-pulse rounded-xl bg-slate-100" />
      )}

      {!cargando && error && (
        <div role="alert" className="mt-5 flex h-80 flex-col items-center justify-center gap-3 rounded-xl bg-error-container/20 p-5 text-center">
          <p className="text-sm font-semibold text-on-error-container">{error}</p>
          <button
            type="button"
            onClick={onReintentar}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-error shadow-sm transition hover:bg-error-container/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/20"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && !hayVentas && (
        <div className="mt-5 flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
          <p className="text-sm font-medium text-slate-500">No hay ventas en el período seleccionado.</p>
        </div>
      )}

      {!cargando && !error && hayVentas && (
        <figure aria-label="Gráfica de ingresos por período" className="mt-5 overflow-x-auto pb-2">
          <div
            className="h-80"
            style={{ minWidth: `${Math.max(620, datos.length * 42)}px` }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datos} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="periodo"
                  tickFormatter={(valor) => formatearPeriodoReporte(valor, agrupacion)}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  minTickGap={16}
                />
                <YAxis
                  tickFormatter={formatearEjeMoneda}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  width={58}
                />
                <Tooltip content={<TooltipVentas />} cursor={{ fill: '#005147', opacity: 0.05 }} />
                <Bar
                  dataKey="ingresos"
                  name="Ingresos"
                  fill="#006b5f"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <table className="sr-only">
            <caption>Detalle de ingresos por período</caption>
            <thead>
              <tr>
                <th>Período</th>
                <th>Ingresos</th>
                <th>Ventas</th>
                <th>Unidades</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((periodo) => (
                <tr key={periodo.periodo}>
                  <td>{formatearFechaReporte(periodo.periodo)}</td>
                  <td>{formatearMoneda(periodo.ingresos)}</td>
                  <td>{formatearNumero(periodo.total_ventas)}</td>
                  <td>{formatearNumero(periodo.unidades_vendidas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )}
    </section>
  );
}
