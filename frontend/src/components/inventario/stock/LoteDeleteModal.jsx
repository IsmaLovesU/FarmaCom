import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

export default function LoteDeleteModal({
  isOpen,
  lote,
  eliminando,
  error = null,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !lote || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <h3 className="font-headline text-lg font-extrabold text-primary">
              Confirmar eliminación
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={eliminando}
            className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm leading-relaxed text-slate-700">
            ¿Eliminar el lote{' '}
            <span className="font-bold text-primary">{lote.numero_lote}</span>?
            Esta acción no se puede deshacer.
          </p>
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
            Los lotes asociados a ventas no pueden eliminarse porque forman parte del historial.
          </p>

          {error && (
            <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={eliminando}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={eliminando}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
