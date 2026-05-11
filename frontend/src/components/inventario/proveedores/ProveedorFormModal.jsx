import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export default function ProveedorFormModal({
  isOpen,
  modoEdicion,
  formulario,
  guardando,
  errorFormulario,
  onClose,
  onSubmit,
  onChange,
}) {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-headline font-extrabold text-primary">
            {modoEdicion ? 'Editar proveedor' : 'Nuevo proveedor'}
          </h3>
          <button type="button" onClick={onClose} disabled={guardando} className="text-slate-500 hover:text-slate-700 disabled:opacity-50" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={onChange}
              maxLength={150}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Ej: Distribuidora Farmacéutica S.A."
            />
          </div>

          {errorFormulario && (
            <p className="text-sm text-red-600 font-semibold">{errorFormulario}</p>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Crear proveedor'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}
