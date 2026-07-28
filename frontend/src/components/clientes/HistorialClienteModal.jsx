import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  Coins,
  Package,
  ReceiptText,
  ShoppingBag,
  Store,
  User,
  X,
} from 'lucide-react';
import { obtenerHistorialCompras } from '../../api/clientes';
import { formatearQuetzales } from '../../utils/pos';

const formatearFecha = (fecha) => {
  const fechaVenta = new Date(fecha);
  if (Number.isNaN(fechaVenta.getTime())) return 'Fecha no disponible';

  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(fechaVenta);
};

function Resumen({ resumen }) {
  const tarjetas = [
    {
      etiqueta: 'Compras completadas',
      valor: resumen.total_compras,
      Icono: ReceiptText,
    },
    {
      etiqueta: 'Artículos adquiridos',
      valor: resumen.total_articulos,
      Icono: Package,
    },
    {
      etiqueta: 'Monto acumulado',
      valor: formatearQuetzales(resumen.monto_total),
      Icono: Coins,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {tarjetas.map(({ etiqueta, valor, Icono }) => (
        <div key={etiqueta} className="rounded-xl border border-slate-200 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-primary">
            <Icono className="h-4 w-4" />
            <p className="text-xs font-extrabold uppercase tracking-wider">{etiqueta}</p>
          </div>
          <p className="mt-2 font-headline text-2xl font-black text-on-surface">{valor}</p>
        </div>
      ))}
    </div>
  );
}

function DetalleVenta({ detalles }) {
  if (!detalles?.length) {
    return (
      <p className="border-t border-slate-100 px-4 py-4 text-sm text-slate-400">
        Esta venta no tiene artículos disponibles para mostrar.
      </p>
    );
  }

  return (
    <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
      <div className="hidden grid-cols-12 gap-3 px-2 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 sm:grid">
        <span className="col-span-6">Producto</span>
        <span className="col-span-2 text-center">Cantidad</span>
        <span className="col-span-2 text-right">Precio</span>
        <span className="col-span-2 text-right">Subtotal</span>
      </div>
      <div className="divide-y divide-slate-200">
        {detalles.map((detalle) => (
          <div
            key={detalle.id_detalle_venta}
            className="grid gap-2 px-2 py-3 text-sm sm:grid-cols-12 sm:items-center sm:gap-3"
          >
            <div className="min-w-0 sm:col-span-6">
              <p className="truncate font-bold text-on-surface">{detalle.nombre_comercial}</p>
              <p className="truncate text-xs text-slate-400">
                {[detalle.codigo, detalle.concentracion, detalle.presentacion]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <p className="font-semibold text-slate-600 sm:col-span-2 sm:text-center">
              <span className="sm:hidden">Cantidad: </span>{detalle.cantidad}
            </p>
            <p className="font-mono font-semibold text-slate-600 sm:col-span-2 sm:text-right">
              <span className="font-sans sm:hidden">Precio: </span>
              {formatearQuetzales(detalle.precio_unitario)}
            </p>
            <p className="font-mono font-extrabold text-primary sm:col-span-2 sm:text-right">
              <span className="font-sans sm:hidden">Subtotal: </span>
              {formatearQuetzales(detalle.subtotal)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VentaHistorial({ compra, expandida, onAlternar }) {
  const anulada = compra.estado === 'anulada';

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="p-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-headline font-extrabold text-primary">
                Venta #{compra.id_venta}
              </p>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                anulada
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
              >
                {anulada ? 'Anulada' : 'Completada'}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatearFecha(compra.fecha_venta)}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="font-mono text-xl font-black text-primary">
              {formatearQuetzales(compra.total)}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              {compra.cantidad_articulos} {Number(compra.cantidad_articulos) === 1
                ? 'artículo'
                : 'artículos'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-primary" />
              {compra.nombre_sucursal}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              {compra.nombre_usuario}
            </span>
            <span className="capitalize">{compra.metodo_pago}</span>
          </div>

          <button
            type="button"
            onClick={onAlternar}
            aria-expanded={expandida}
            className="inline-flex items-center gap-1 self-start text-xs font-extrabold text-primary hover:text-primary-container sm:self-auto"
          >
            {expandida ? 'Ocultar detalle' : 'Ver detalle'}
            <ChevronDown className={`h-4 w-4 transition-transform ${expandida ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {anulada && compra.motivo_anulacion && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            Motivo de anulación: {compra.motivo_anulacion}
          </p>
        )}
      </div>

      {expandida && <DetalleVenta detalles={compra.detalles} />}
    </article>
  );
}

export default function HistorialClienteModal({ cliente, onClose }) {
  const [historial, setHistorial] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [ventaExpandida, setVentaExpandida] = useState(null);

  useEffect(() => {
    if (!cliente) return undefined;

    let vigente = true;
    setCargando(true);
    setHistorial(null);
    setError(null);
    setVentaExpandida(null);

    obtenerHistorialCompras(cliente.id_cliente)
      .then((datos) => {
        if (vigente) setHistorial(datos);
      })
      .catch((err) => {
        if (vigente) {
          setError(err.response?.data?.mensaje || 'No se pudo cargar el historial de ventas.');
        }
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [cliente]);

  if (!cliente || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-historial-cliente"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3
                id="titulo-historial-cliente"
                className="truncate font-headline text-lg font-extrabold text-primary"
              >
                Historial de ventas
              </h3>
              <p className="truncate text-sm font-medium text-slate-500">
                {cliente.nombre_cliente}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-64 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {cargando && (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <ReceiptText className="mb-3 h-8 w-8 animate-pulse text-primary" />
              <p className="text-sm font-semibold text-slate-500">
                Cargando historial de ventas...
              </p>
            </div>
          )}

          {!cargando && error && (
            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {!cargando && historial && (
            <div className="space-y-5">
              <Resumen resumen={historial.resumen} />

              {historial.compras.length === 0 ? (
                <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-center">
                  <ReceiptText className="mb-3 h-8 w-8 text-slate-300" />
                  <p className="font-bold text-slate-600">Sin ventas registradas</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Este cliente todavía no tiene compras asociadas.
                  </p>
                </div>
              ) : (
                <section className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Ventas realizadas
                  </h4>
                  {historial.compras.map((compra) => (
                    <VentaHistorial
                      key={compra.id_venta}
                      compra={compra}
                      expandida={ventaExpandida === compra.id_venta}
                      onAlternar={() => setVentaExpandida((actual) => (
                        actual === compra.id_venta ? null : compra.id_venta
                      ))}
                    />
                  ))}
                </section>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
