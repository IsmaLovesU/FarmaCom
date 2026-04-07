import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function SucursalFormModal({
  isOpen,
  modoEdicion,
  formulario,
  ciudades,
  cargandoCiudades,
  guardando,
  errorFormulario,
  onClose,
  onSubmit,
  onChange,
}) {
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-headline font-extrabold text-primary">
            {modoEdicion ? 'Editar sucursal' : 'Nueva sucursal'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Nombre de sucursal</label>
            <input
              type="text"
              name="nombre_sucursal"
              value={formulario.nombre_sucursal}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Ej: Farmacia Central Norte"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Ciudad</label>
            <div className="relative">
              <select
                name="id_ciudad"
                value={formulario.id_ciudad}
                onChange={onChange}
                className="w-full appearance-none rounded-xl border border-slate-300 px-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                disabled={cargandoCiudades}
                required
              >
                <option value="">Selecciona una ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                    {ciudad.nombre_ciudad}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {!cargandoCiudades && ciudades.length === 0 && (
              <p className="text-xs text-error font-medium">No hay ciudades registradas todavía. Recarga la página después de levantar backend.</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Dirección</label>
            <textarea
              name="direccion"
              value={formulario.direccion}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm min-h-24 focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Ej: Calle 10 #45-20"
              required
            />
          </div>

          {errorFormulario && (
            <p className="text-sm text-error font-semibold">{errorFormulario}</p>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || cargandoCiudades || ciudades.length === 0}
              className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Crear sucursal'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}
