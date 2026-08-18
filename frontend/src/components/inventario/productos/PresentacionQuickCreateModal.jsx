import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { PackagePlus, X } from 'lucide-react';

export default function PresentacionQuickCreateModal({ isOpen, guardando, onClose, onCrear }) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setNombre('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      setError('El nombre es requerido.');
      return;
    }

    try {
      setError(null);
      await onCrear({ nombre: nombreLimpio });
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo crear la presentación.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PackagePlus className="h-4 w-4" />
            </span>
            <h3 className="font-headline text-base font-extrabold text-primary">
              Nueva presentación
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-4 px-5 py-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Nombre <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Frasco, Sobre, Ampolla..."
              maxLength={100}
              autoFocus
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {error && <p className="text-sm font-semibold text-error">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Crear presentación'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}
