import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Trash2, X } from 'lucide-react';

export default function PresentacionDeleteModal({
  isOpen,
  presentacion,
  productosAsociados = 0,
  eliminando,
  error,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !presentacion || typeof document === 'undefined') return null;
  const estaEnUso = productosAsociados > 0;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 className="h-4 w-4" />
            </span>
            <h3 className="font-headline text-base font-extrabold text-primary">
              {estaEnUso ? 'No se puede eliminar' : 'Confirmar eliminación'}
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

        <div className="space-y-4 px-5 py-4">
          {estaEnUso ? (
            <p className="text-sm text-slate-700">
              La presentación{' '}
              <span className="font-bold text-primary">{presentacion.nombre}</span>{' '}
              se usa en {productosAsociados}{' '}
              {productosAsociados === 1 ? 'producto' : 'productos'} y no se puede eliminar.
            </p>
          ) : (
            <>
              <p className="text-sm text-slate-700">
                ¿Eliminar la presentación{' '}
                <span className="font-bold text-primary">{presentacion.nombre}</span>?
              </p>
              <p className="text-xs text-slate-500">
                Esta acción no se puede deshacer.
              </p>
            </>
          )}

          {error && <p className="text-sm font-semibold text-error">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={eliminando}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {estaEnUso ? 'Entendido' : 'Cancelar'}
            </button>
            {!estaEnUso && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={eliminando}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
