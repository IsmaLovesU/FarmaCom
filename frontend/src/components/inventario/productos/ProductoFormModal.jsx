import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';
import { motion } from 'motion/react';

const ESTADO_INICIAL = {
  nombre_comercial: '',
  nombre_generico: '',
  id_categoria: '',
  id_casa: '',
  id_proveedor: '',
  precio_compra: '',
  stock_minimo: '',
  meses_alerta_vencimiento: '',
  aplica_mayoreo: false,
  activo: true,
};

export default function ProductoFormModal({
  isOpen,
  modoEdicion,
  producto,
  categorias,
  casas,
  proveedores,
  cargandoDatos,
  guardando,
  errorFormulario,
  onClose,
  onSubmit,
}) {
  const [formulario, setFormulario] = useState(ESTADO_INICIAL);

  useEffect(() => {
    if (!isOpen) return;

    if (modoEdicion && producto) {
      setFormulario({
        nombre_comercial: producto.nombre_comercial || '',
        nombre_generico: producto.nombre_generico || '',
        id_categoria: String(producto.id_categoria || ''),
        id_casa: String(producto.id_casa || ''),
        id_proveedor: String(producto.id_proveedor || ''),
        precio_compra: producto.precio_compra != null ? String(producto.precio_compra) : '',
        stock_minimo: producto.stock_minimo != null ? String(producto.stock_minimo) : '',
        meses_alerta_vencimiento:
          producto.meses_alerta_vencimiento != null
            ? String(producto.meses_alerta_vencimiento)
            : '',
        aplica_mayoreo: producto.aplica_mayoreo ?? false,
        activo: producto.activo ?? true,
      });
    } else {
      setFormulario(ESTADO_INICIAL);
    }
  }, [isOpen, modoEdicion, producto]);

  if (!isOpen || typeof document === 'undefined') return null;

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const manejarToggleActivo = () => {
    setFormulario((prev) => ({ ...prev, activo: !prev.activo }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    onSubmit(formulario);
  };

  const codigoMostrado = modoEdicion && producto?.codigo ? producto.codigo : 'PRD-AUTO';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 my-auto"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-headline font-extrabold text-primary">
            {modoEdicion ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Código</label>
              <input
                type="text"
                value={codigoMostrado}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Estado</label>
              <div className="flex items-center gap-3 h-[42px]">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formulario.activo}
                  onClick={manejarToggleActivo}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    formulario.activo ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formulario.activo ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-700">
                  {formulario.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Nombre comercial <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="nombre_comercial"
              value={formulario.nombre_comercial}
              onChange={manejarCambio}
              placeholder="Ej. Aspirina Forte"
              maxLength={150}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Nombre genérico</label>
            <input
              type="text"
              name="nombre_generico"
              value={formulario.nombre_generico}
              onChange={manejarCambio}
              placeholder="Ej. Ácido Acetilsalicílico"
              maxLength={150}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Categoría <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_categoria"
                  value={formulario.id_categoria}
                  onChange={manejarCambio}
                  required
                  disabled={cargandoDatos}
                  className="w-full appearance-none rounded-xl border border-slate-300 px-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">Seleccionar...</option>
                  {(categorias || []).map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Casa farmacéutica <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_casa"
                  value={formulario.id_casa}
                  onChange={manejarCambio}
                  required
                  disabled={cargandoDatos}
                  className="w-full appearance-none rounded-xl border border-slate-300 px-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">Seleccionar...</option>
                  {(casas || []).map((cf) => (
                    <option key={cf.id_casa} value={cf.id_casa}>
                      {cf.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Proveedor</label>
            <div className="relative">
              <select
                name="id_proveedor"
                value={formulario.id_proveedor}
                onChange={manejarCambio}
                disabled={cargandoDatos}
                className="w-full appearance-none rounded-xl border border-slate-300 px-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">Sin proveedor</option>
                {(proveedores || []).map((p) => (
                  <option key={p.id_proveedor} value={p.id_proveedor}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="pt-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">
              Métricas de inventario
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Precio compra (Q) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  name="precio_compra"
                  value={formulario.precio_compra}
                  onChange={manejarCambio}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Stock mínimo</label>
                <input
                  type="number"
                  name="stock_minimo"
                  value={formulario.stock_minimo}
                  onChange={manejarCambio}
                  placeholder="0"
                  min="0"
                  step="1"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1 mt-4">
              <label className="text-sm font-semibold text-slate-700">
                Meses alerta vencimiento <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="meses_alerta_vencimiento"
                value={formulario.meses_alerta_vencimiento}
                onChange={manejarCambio}
                placeholder="Ej. 6"
                min="1"
                step="1"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              name="aplica_mayoreo"
              checked={formulario.aplica_mayoreo}
              onChange={manejarCambio}
              className="mt-0.5 h-4 w-4 rounded accent-primary cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-slate-700">Aplica para mayoreo</p>
              <p className="text-xs text-slate-500">Permite precios especiales por volumen</p>
            </div>
          </label>

          {errorFormulario && (
            <p className="text-sm text-error font-semibold">{errorFormulario}</p>
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
              disabled={guardando || cargandoDatos}
              className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60"
            >
              {guardando
                ? 'Guardando...'
                : modoEdicion
                ? 'Guardar cambios'
                : 'Guardar producto'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}