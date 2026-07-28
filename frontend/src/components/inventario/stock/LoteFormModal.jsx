import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, PackagePlus, X } from 'lucide-react';
import { motion } from 'motion/react';
import { obtenerEtiquetaPresentacion } from '../../../constants/presentaciones.js';

const ESTADO_INICIAL = {
  id_producto: '',
  id_proveedor: '',
  id_sucursal: '',
  numero_lote: '',
  fecha_vencimiento: '',
  cantidad_ingresada: '',
  margen_ganancia: '',
  precio_venta: '',
  precio_mayoreo: '',
  cantidad_mayoreo: '',
};

const fechaManana = () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  const offset = fecha.getTimezoneOffset() * 60000;
  return new Date(fecha.getTime() - offset).toISOString().slice(0, 10);
};

const formatoDecimal = (valor, decimales = 2) => {
  if (!Number.isFinite(valor)) return '';
  return valor.toFixed(decimales);
};

const esEnteroPositivo = (valor) => {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= 1;
};

export default function LoteFormModal({
  isOpen,
  productos,
  proveedores,
  sucursales,
  sucursalInicialId,
  cargandoDatos,
  guardando = false,
  errorFormulario = null,
  onClose,
  onSubmit,
}) {
  const [formulario, setFormulario] = useState(ESTADO_INICIAL);
  const [errorLocal, setErrorLocal] = useState(null);

  const productosActivos = useMemo(
    () => (productos || []).filter((producto) => producto.activo),
    [productos],
  );

  const productoSeleccionado = useMemo(
    () => productosActivos.find((producto) => String(producto.id_producto) === formulario.id_producto),
    [productosActivos, formulario.id_producto],
  );

  const precioCompra = Number(productoSeleccionado?.precio_compra ?? 0);
  const presentacionEtiqueta = obtenerEtiquetaPresentacion(productoSeleccionado?.presentacion);

  useEffect(() => {
    if (!isOpen) return;

    setFormulario({
      ...ESTADO_INICIAL,
      id_sucursal: sucursalInicialId ? String(sucursalInicialId) : '',
    });
    setErrorLocal(null);
  }, [isOpen, sucursalInicialId]);

  if (!isOpen || typeof document === 'undefined') return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setErrorLocal(null);
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarPrecioChange = (campo, valor) => {
    setErrorLocal(null);

    setFormulario((prev) => {
      if (campo === 'margen_ganancia') {
        const margen = Number(valor);
        const precio = valor === '' ? '' : formatoDecimal(precioCompra * (1 + margen / 100), 2);
        return { ...prev, margen_ganancia: valor, precio_venta: precio };
      }

      if (campo === 'precio_venta') {
        const precio = Number(valor);
        const margen = valor === '' || precioCompra <= 0
          ? ''
          : formatoDecimal(((precio / precioCompra) - 1) * 100, 4);
        return { ...prev, precio_venta: valor, margen_ganancia: margen };
      }

      return { ...prev, [campo]: valor };
    });
  };

  const validarFormulario = () => {
    if (!formulario.id_producto) return 'Selecciona un producto.';
    if (!formulario.id_proveedor) return 'Selecciona un proveedor.';
    if (!formulario.id_sucursal) return 'Selecciona una sucursal.';
    if (!formulario.numero_lote.trim()) return 'Ingresa el número de lote.';
    if (!formulario.fecha_vencimiento) return 'Selecciona la fecha de vencimiento.';
    if (!esEnteroPositivo(formulario.cantidad_ingresada)) {
      return 'La cantidad ingresada debe ser un entero mayor a 0.';
    }
    if (!formulario.presentacion_ingreso.trim()) return 'Escribe la presentación de ingreso.';
    if (!esEnteroPositivo(formulario.factor_conversion_ingreso)) {
      return 'El factor de conversión debe ser un entero mayor o igual a 1.';
    }
    if (formulario.precio_venta === '' || Number(formulario.precio_venta) < 0) {
      return 'Ingresa un precio de venta válido.';
    }
    if (formulario.margen_ganancia === '' || Number(formulario.margen_ganancia) < 0) {
      return 'Ingresa un margen válido.';
    }

    const tienePrecioMayoreo = formulario.precio_mayoreo !== '';
    const tieneCantidadMayoreo = formulario.cantidad_mayoreo !== '';
    if (tienePrecioMayoreo !== tieneCantidadMayoreo) {
      return 'Completa precio y cantidad de mayoreo, o deja ambos vacíos.';
    }
    if (tieneCantidadMayoreo && Number(formulario.cantidad_mayoreo) < 1) {
      return 'La cantidad de mayoreo debe ser mayor a 0.';
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVencimiento = new Date(`${formulario.fecha_vencimiento}T00:00:00`);
    if (fechaVencimiento <= hoy) return 'La fecha de vencimiento debe ser posterior a hoy.';

    return null;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    const error = validarFormulario();
    if (error) {
      setErrorLocal(error);
      return;
    }

    onSubmit({
      id_producto: Number(formulario.id_producto),
      id_proveedor: Number(formulario.id_proveedor),
      id_sucursal: Number(formulario.id_sucursal),
      numero_lote: formulario.numero_lote.trim(),
      fecha_vencimiento: formulario.fecha_vencimiento,
      cantidad_ingresada: Number(formulario.cantidad_ingresada),
      precio_venta: Number(formulario.precio_venta),
      margen_ganancia: Number(formulario.margen_ganancia),
      precio_mayoreo: formulario.precio_mayoreo === '' ? null : Number(formulario.precio_mayoreo),
      cantidad_mayoreo: formulario.cantidad_mayoreo === '' ? null : Number(formulario.cantidad_mayoreo),
    });
  };

  const renderSelectIcon = () => (
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-auto flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <PackagePlus className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-headline text-lg font-extrabold text-primary">
                Ingresar lote
              </h3>
              <p className="truncate text-xs text-slate-500">
                Registro manual para el inventario de sucursal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-5 overflow-y-auto px-6 py-5">
          <section className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Datos del lote
            </p>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Producto <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_producto"
                  value={formulario.id_producto}
                  onChange={manejarCambio}
                  disabled={cargandoDatos}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">Seleccionar producto...</option>
                  {productosActivos.map((producto) => (
                    <option key={producto.id_producto} value={producto.id_producto}>
                      {producto.nombre_comercial}
                      {producto.concentracion ? ` ${producto.concentracion}` : ''}
                      {producto.presentacion ? ` · ${obtenerEtiquetaPresentacion(producto.presentacion)}` : ''}
                      {' '}- {producto.codigo}
                    </option>
                  ))}
                </select>
                {renderSelectIcon()}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Precio compra</label>
                <input
                  type="text"
                  value={productoSeleccionado ? `Q${Number(productoSeleccionado.precio_compra).toFixed(2)}` : 'Q0.00'}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Proveedor <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_proveedor"
                    value={formulario.id_proveedor}
                    onChange={manejarCambio}
                    disabled={cargandoDatos}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">Seleccionar...</option>
                    {(proveedores || []).map((proveedor) => (
                      <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </select>
                  {renderSelectIcon()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Sucursal <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_sucursal"
                    value={formulario.id_sucursal}
                    onChange={manejarCambio}
                    disabled={cargandoDatos}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">Seleccionar...</option>
                    {(sucursales || []).map((sucursal) => (
                      <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                        {sucursal.nombre_sucursal}
                      </option>
                    ))}
                  </select>
                  {renderSelectIcon()}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Número de lote <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="numero_lote"
                  value={formulario.numero_lote}
                  onChange={manejarCambio}
                  placeholder="Ej. LT-2026-001"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Vencimiento <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={formulario.fecha_vencimiento}
                  onChange={manejarCambio}
                  min={fechaManana()}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Cantidad ingresada <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  name="cantidad_ingresada"
                  value={formulario.cantidad_ingresada}
                  onChange={manejarCambio}
                  placeholder="0"
                  min="1"
                  step="1"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Presentación</label>
              <input
                type="text"
                value={presentacionEtiqueta || 'Depende del producto seleccionado'}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
              />
              <p className="text-xs text-slate-500">
                La presentación viene del producto. Si necesitas otra, regístrala como un producto aparte.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Precio de venta del lote
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Margen % <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    value={formulario.margen_ganancia}
                    onChange={(e) => manejarPrecioChange('margen_ganancia', e.target.value)}
                    min="0"
                    step="0.0001"
                    required
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Precio venta <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    value={formulario.precio_venta}
                    onChange={(e) => manejarPrecioChange('precio_venta', e.target.value)}
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Precio mayoreo</label>
                  <input
                    type="number"
                    value={formulario.precio_mayoreo}
                    onChange={(e) => manejarPrecioChange('precio_mayoreo', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Cantidad mayoreo</label>
                  <input
                    type="number"
                    value={formulario.cantidad_mayoreo}
                    onChange={(e) => manejarPrecioChange('cantidad_mayoreo', e.target.value)}
                    min="1"
                    step="1"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </section>

          {(errorLocal || errorFormulario) && (
            <p className="text-sm font-semibold text-error">{errorLocal || errorFormulario}</p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-2">
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
              disabled={cargandoDatos || guardando}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Guardar lote'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}
