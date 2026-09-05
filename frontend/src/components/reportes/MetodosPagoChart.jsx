import React from 'react';
import { CreditCard, RefreshCw } from 'lucide-react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';
import { formatearMoneda, formatearNumero } from '../../utils/reportes';

const COLORES_METODO = {
  efectivo: '#006b5f',
  tarjeta: '#f59e0b',
};

const COLORES_ADICIONALES = ['#0284c7', '#7c3aed', '#e11d48'];

const obtenerColorMetodo = (metodo, indice) => (
  COLORES_METODO[metodo] || COLORES_ADICIONALES[indice % COLORES_ADICIONALES.length]
);

const formatearMetodo = (metodo = '') => (
  metodo
    .replaceAll('_', ' ')
    .replace(/^./, (letra) => letra.toUpperCase())
);

export default function MetodosPagoChart({ datos, cargando, error, onReintentar }) {
  const datosPreparados = datos?.map((metodo, indice) => ({
    ...metodo,
    color: obtenerColorMetodo(metodo.metodo_pago, indice),
  })) ?? [];
  const datosDisponibles = datosPreparados.filter((metodo) => metodo.ingresos > 0);
  const totalIngresos = datosDisponibles.reduce(
    (total, metodo) => total + metodo.ingresos,
    0,
  );

  return (
    <section
      aria-labelledby="titulo-metodos-pago"
      className="h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center gap-2.5">
        <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="titulo-metodos-pago" className="font-headline text-lg font-extrabold text-on-surface">
          Métodos de pago
        </h2>
      </div>

      {cargando && (
        <div aria-label="Cargando métodos de pago" className="mt-5 h-80 animate-pulse rounded-xl bg-slate-100" />
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

      {!cargando && !error && datosDisponibles.length === 0 && (
        <div className="mt-5 flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
          <p className="text-sm font-medium text-slate-500">No hay pagos en el período seleccionado.</p>
        </div>
      )}

      {!cargando && !error && datosDisponibles.length > 0 && (
        <figure aria-label="Distribución de ingresos por método de pago" className="mt-4">
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosDisponibles}
                  dataKey="ingresos"
                  nameKey="metodo_pago"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {datosDisponibles.map((metodo) => (
                    <Cell
                      key={metodo.metodo_pago}
                      fill={metodo.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Total
              </span>
              <strong className="mt-0.5 font-headline text-base font-extrabold text-primary">
                {formatearMoneda(totalIngresos)}
              </strong>
            </div>
          </div>

          <ul className="mt-2 space-y-2.5">
            {datosPreparados.map((metodo) => (
              <li
                key={metodo.metodo_pago}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: metodo.color }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-on-surface">
                      {formatearMetodo(metodo.metodo_pago)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatearNumero(metodo.total_ventas)} ventas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-primary">
                    {metodo.porcentaje_ingresos}%
                  </p>
                  <p className="text-xs text-slate-500">{formatearMoneda(metodo.ingresos)}</p>
                </div>
              </li>
            ))}
          </ul>
        </figure>
      )}
    </section>
  );
}
