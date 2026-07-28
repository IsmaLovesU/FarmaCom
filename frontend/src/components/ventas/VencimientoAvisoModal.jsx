import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(fecha));
};

export default function VencimientoAvisoModal({
  isOpen,
  productos,
  titulo,
  mensaje,
  procesando = false,
  onClose,
  onConfirm,
}) {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <h3 className="font-headline text-lg font-extrabold text-primary">{titulo}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={procesando}
            aria-label="Cerrar"
            className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm leading-relaxed text-slate-700">{mensaje}</p>

          <ul className="max-h-48 space-y-2 overflow-y-auto rounded-xl bg-amber-50 p-3">
            {productos.map((producto) => (
              <li
                key={producto.clave || producto.carritoKey}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0 truncate font-semibold text-on-surface">
                  {producto.nombre_comercial}
                </span>
                <span className="shrink-0 text-xs font-medium text-amber-700">
                  Lote {producto.numero_lote} · vence {formatearFecha(producto.fecha_vencimiento)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={procesando}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={procesando}
              className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {procesando ? 'Procesando...' : 'Sí, continuar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
