import React from 'react';
import { PackageSearch, RefreshCw } from 'lucide-react';
import { formatearMoneda, formatearNumero } from '../../utils/reportes';

export default function TopProductosTable({
  datos = [],
  criterio,
  cargando,
  error,
  onCriterioChange,
  onReintentar,
}) {
  return (
    <section
      aria-labelledby="titulo-top-productos"
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <PackageSearch className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="titulo-top-productos" className="font-headline text-lg font-extrabold text-on-surface">
            Productos más vendidos
          </h2>
        </div>

        <div
          role="group"
          aria-label="Criterio del ranking"
          className="inline-flex w-fit rounded-xl bg-slate-100 p-1"
        >
          {[
            { valor: 'cantidad', etiqueta: 'Cantidad' },
            { valor: 'ingresos', etiqueta: 'Ingresos' },
          ].map((opcion) => {
            const estaActivo = criterio === opcion.valor;
            return (
              <button
                key={opcion.valor}
                type="button"
                aria-pressed={estaActivo}
                disabled={cargando}
                onClick={() => {
                  if (!estaActivo) onCriterioChange(opcion.valor);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-wait ${
                  estaActivo
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                {opcion.etiqueta}
              </button>
            );
          })}
        </div>
      </div>

      {cargando && (
        <div aria-label="Cargando productos más vendidos" className="mt-5 space-y-3">
          {[1, 2, 3, 4, 5].map((fila) => (
            <div key={fila} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      )}

      {!cargando && error && (
        <div role="alert" className="mt-5 flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl bg-error-container/20 p-5 text-center">
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

      {!cargando && !error && datos.length === 0 && (
        <div className="mt-5 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
          <p className="text-sm font-medium text-slate-500">
            No hay productos vendidos en el período seleccionado.
          </p>
        </div>
      )}

      {!cargando && !error && datos.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-y-2">
            <caption className="sr-only">
              Ranking de productos ordenado por {criterio === 'ingresos' ? 'ingresos' : 'cantidad vendida'}
            </caption>
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                <th className="px-3 pb-1">Posición</th>
                <th className="px-3 pb-1">Producto</th>
                <th className="px-3 pb-1 text-right">Cantidad</th>
                <th className="px-3 pb-1 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((producto, indice) => (
                  <tr key={producto.id_producto} className="bg-slate-50/80">
                    <td className="rounded-l-xl px-3 py-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 font-headline text-sm font-extrabold text-primary">
                        {indice + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-headline text-sm font-extrabold text-on-surface">
                        {producto.nombre_comercial}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        {producto.codigo && <span>{producto.codigo}</span>}
                        {producto.codigo && producto.nombre_generico && <span aria-hidden="true">·</span>}
                        {producto.nombre_generico && <span>{producto.nombre_generico}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-extrabold text-primary">
                      {formatearNumero(producto.cantidad_vendida)}
                    </td>
                    <td className="rounded-r-xl px-3 py-3 text-right text-sm font-extrabold text-primary">
                      {formatearMoneda(producto.ingresos_generados)}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
