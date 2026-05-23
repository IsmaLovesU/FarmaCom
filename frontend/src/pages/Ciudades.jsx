import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { AlertTriangle, MapPin, Pencil, PlusCircle, Search, Trash2, X } from 'lucide-react';
import SucursalAlert from '../components/sucursales/SucursalAlert.jsx';
import useCiudades from '../hooks/useCiudades';

const formularioInicial = { nombre_ciudad: '' };

function CiudadFormModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-headline text-lg font-extrabold text-primary">
            {modoEdicion ? 'Editar ciudad' : 'Nueva ciudad'}
          </h3>
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

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <input
              type="text"
              name="nombre_ciudad"
              value={formulario.nombre_ciudad}
              onChange={onChange}
              maxLength={100}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: Guatemala"
            />
          </div>

          {errorFormulario && (
            <p className="text-sm font-semibold text-red-600">{errorFormulario}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
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
              {guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Crear ciudad'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}

function CiudadDeleteModal({ isOpen, ciudad, eliminando, onClose, onConfirm }) {
  if (!isOpen || !ciudad || typeof document === 'undefined') return null;

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
            <h3 className="font-headline text-lg font-extrabold text-primary">Confirmar eliminacion</h3>
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
            Eliminar la ciudad <span className="font-bold text-primary">{ciudad.nombre_ciudad}</span>.
            No se podra eliminar si esta asociada a una sucursal.
          </p>
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
              {eliminando ? 'Eliminando...' : 'Si, eliminar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

export default function Ciudades() {
  const { ciudades, cargandoCiudades, errorCiudades, crear, actualizar, eliminar } = useCiudades();
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [ciudadAEliminar, setCiudadAEliminar] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [errorAccion, setErrorAccion] = useState(null);

  const ciudadesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return ciudades;
    return ciudades.filter((ciudad) => ciudad.nombre_ciudad.toLowerCase().includes(termino));
  }, [busqueda, ciudades]);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setIdEditando(null);
    setFormulario(formularioInicial);
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (ciudad) => {
    setModoEdicion(true);
    setIdEditando(ciudad.id_ciudad);
    setFormulario({ nombre_ciudad: ciudad.nombre_ciudad || '' });
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    if (!guardando) setMostrarModal(false);
  };

  const manejarGuardar = async (event) => {
    event.preventDefault();
    setErrorFormulario(null);

    const nombreCiudad = formulario.nombre_ciudad.trim();
    if (!nombreCiudad) {
      setErrorFormulario('El nombre de la ciudad es requerido.');
      return;
    }

    try {
      setGuardando(true);
      if (modoEdicion && idEditando) {
        await actualizar(idEditando, { nombre_ciudad: nombreCiudad });
      } else {
        await crear({ nombre_ciudad: nombreCiudad });
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
    } catch (err) {
      setErrorFormulario(err.response?.data?.mensaje || 'No se pudo guardar la ciudad.');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!ciudadAEliminar) return;

    try {
      setErrorAccion(null);
      setEliminandoId(ciudadAEliminar.id_ciudad);
      await eliminar(ciudadAEliminar.id_ciudad);
      setCiudadAEliminar(null);
    } catch (err) {
      setErrorAccion(err.response?.data?.mensaje || 'No se pudo eliminar la ciudad.');
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-surface-container-low/70 px-5 py-5"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="font-headline text-xl font-extrabold text-primary">Ciudades</p>
              <p className="text-sm font-medium text-slate-500">{ciudadesFiltradas.length} registradas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={abrirModalCrear}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-primary to-primary-container px-6 py-3 font-headline text-sm font-bold text-white shadow-[0_4px_12px_rgba(0,81,71,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,81,71,0.3)] active:translate-y-0 md:w-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva ciudad
          </button>
        </div>
      </motion.div>

      <div className="rounded-2xl bg-surface-container-low p-4">
        <div className="group relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-xl border-none bg-surface-container-lowest py-3 pl-12 pr-4 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <SucursalAlert mensaje={errorCiudades || errorAccion} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-surface-container-low/60">
        <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-surface-container-low px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className="col-span-1">#</span>
          <span className="col-span-7">Nombre</span>
          <span className="col-span-4 text-center">Acciones</span>
        </div>

        {cargandoCiudades ? (
          <div className="px-5 py-10 text-center font-medium text-slate-500">Cargando ciudades...</div>
        ) : ciudadesFiltradas.length === 0 ? (
          <div className="px-5 py-10 text-center font-medium text-slate-500">No hay ciudades para mostrar.</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {ciudadesFiltradas.map((ciudad) => (
              <div key={ciudad.id_ciudad} className="grid grid-cols-12 items-center gap-4 bg-white/60 px-5 py-4">
                <span className="col-span-1 font-mono text-sm text-slate-400">{ciudad.id_ciudad}</span>
                <span className="col-span-7 font-semibold text-primary">{ciudad.nombre_ciudad}</span>
                <div className="col-span-4 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => abrirModalEditar(ciudad)}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/20 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setCiudadAEliminar(ciudad)}
                    disabled={eliminandoId === ciudad.id_ciudad}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {eliminandoId === ciudad.id_ciudad ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <CiudadFormModal
        isOpen={mostrarModal}
        modoEdicion={modoEdicion}
        formulario={formulario}
        guardando={guardando}
        errorFormulario={errorFormulario}
        onClose={cerrarModal}
        onSubmit={manejarGuardar}
        onChange={(event) => {
          const { name, value } = event.target;
          setFormulario((prev) => ({ ...prev, [name]: value }));
        }}
      />

      <CiudadDeleteModal
        isOpen={Boolean(ciudadAEliminar)}
        ciudad={ciudadAEliminar}
        eliminando={Boolean(eliminandoId)}
        onClose={() => { if (!eliminandoId) setCiudadAEliminar(null); }}
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
