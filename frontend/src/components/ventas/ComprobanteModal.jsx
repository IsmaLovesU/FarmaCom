import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Printer, X } from 'lucide-react';
import { formatearQuetzales } from '../../utils/pos';

const etiquetasMetodo = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  mixto: 'Mixto',
};

const formatearFechaHora = (valor) => {
  if (!valor) return '';
  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(valor));
};

export default function ComprobanteModal({ isOpen, venta, onClose }) {
  if (!isOpen || !venta || typeof document === 'undefined') return null;

  const detalles = venta.detalles || [];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/55 p-4 backdrop-blur-sm print:bg-white print:p-0">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .comprobante-imprimible, .comprobante-imprimible * { visibility: visible; }
          .comprobante-imprimible {
            position: absolute;
            inset: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
          }
          .no-imprimir { display: none !important; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="comprobante-imprimible my-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="no-imprimir flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <h3 className="font-headline text-lg font-extrabold text-primary">
              Venta registrada
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5 font-mono text-sm text-on-surface">
          <div className="text-center">
            <p className="font-headline text-base font-extrabold text-primary">
              FarmaCom San Gabriel
            </p>
            <p className="text-xs text-slate-500">{venta.nombre_sucursal}</p>
            <p className="mt-1 text-xs text-slate-400">
              Comprobante #{venta.id_venta} · {formatearFechaHora(venta.fecha_venta)}
            </p>
          </div>

          <div className="border-t border-dashed border-slate-300 pt-3 text-xs text-slate-600">
            <p>Cliente: {venta.nombre_cliente || 'Consumidor final'}</p>
            <p>Atendió: {venta.nombre_usuario}</p>
            <p>Método de pago: {etiquetasMetodo[venta.metodo_pago] || venta.metodo_pago}</p>
          </div>

          <div className="space-y-2 border-t border-dashed border-slate-300 pt-3">
            {detalles.map((item) => (
              <div key={item.id_detalle_venta} className="flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-bold text-on-surface">{item.nombre_comercial}</p>
                  <p className="text-slate-400">
                    {item.cantidad} x {formatearQuetzales(item.precio_unitario)}
                  </p>
                </div>
                <p className="shrink-0 font-bold">{formatearQuetzales(item.subtotal)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-1 border-t border-dashed border-slate-300 pt-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Monto recibido</span>
              <span>{formatearQuetzales(venta.monto_recibido)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Cambio</span>
              <span>{formatearQuetzales(venta.cambio)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-extrabold text-primary">
              <span>Total</span>
              <span>{formatearQuetzales(venta.total)}</span>
            </div>
          </div>

          <p className="border-t border-dashed border-slate-300 pt-3 text-center text-[11px] text-slate-400">
            Gracias por su compra
          </p>
        </div>

        <div className="no-imprimir flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
          >
            <Printer className="h-4 w-4" />
            Imprimir comprobante
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
