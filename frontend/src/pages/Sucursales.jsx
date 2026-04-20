import React, { useMemo, useState } from 'react';
import { 
  Search, 
  PlusCircle
} from 'lucide-react';
import SucursalFormModal from '../components/sucursales/SucursalFormModal.jsx';
import SucursalTable from '../components/sucursales/SucursalTable.jsx';
import SucursalDeleteModal from '../components/sucursales/SucursalDeleteModal.jsx';
import { motion } from 'motion/react';
import useSucursales from '../hooks/useSucursales';
import useCiudades from '../hooks/useCiudades';

const estadoInicialFormulario = {
  nombre_sucursal: '',
  direccion: '',
  id_ciudad: '',
};

export default function Sucursales() {
  const { sucursales, cargando, error, crear, actualizar, eliminar } = useSucursales();
  const { ciudades, cargandoCiudades, errorCiudades } = useCiudades();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [errorAccion, setErrorAccion] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(estadoInicialFormulario);
  const [sucursalAEliminar, setSucursalAEliminar] = useState(null);

  const mapaCiudades = useMemo(() => {
    return ciudades.reduce((acc, ciudad) => {
      acc[ciudad.id_ciudad] = ciudad.nombre_ciudad;
      return acc;
    }, {});
  }, [ciudades]);

  const sucursalesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) {
      return sucursales;
    }
    return sucursales.filter((sucursal) => {
      const nombre = sucursal.nombre_sucursal?.toLowerCase() || '';
      const direccion = sucursal.direccion?.toLowerCase() || '';
      const ciudad = mapaCiudades[sucursal.id_ciudad]?.toLowerCase() || '';
      return nombre.includes(termino) || direccion.includes(termino) || ciudad.includes(termino);
    });
  }, [busqueda, mapaCiudades, sucursales]);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setIdEditando(null);
    setFormulario(estadoInicialFormulario);
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (sucursal) => {
    setModoEdicion(true);
    setIdEditando(sucursal.id_sucursal);
    setFormulario({
      nombre_sucursal: sucursal.nombre_sucursal || '',
      direccion: sucursal.direccion || '',
      id_ciudad: String(sucursal.id_ciudad || ''),
    });
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    if (guardando) {
      return;
    }
    setMostrarModal(false);
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardar = async (evento) => {
    evento.preventDefault();
    setErrorFormulario(null);

    const nombre = formulario.nombre_sucursal.trim();
    const direccion = formulario.direccion.trim();
    const idCiudad = Number(formulario.id_ciudad);

    if (!nombre || !direccion || !idCiudad) {
      setErrorFormulario('Completa todos los campos del formulario.');
      return;
    }

    if (nombre.length > 100) {
      setErrorFormulario('El nombre de la sucursal no puede superar los 100 caracteres.');
      return;
    }

    if (direccion.length > 255) {
      setErrorFormulario('La dirección no puede superar los 255 caracteres.');
      return;
    }

    const payload = {
      nombre_sucursal: nombre,
      direccion,
      id_ciudad: idCiudad,
    };

    try {
      setGuardando(true);
      if (modoEdicion && idEditando) {
        await actualizar(idEditando, payload);
      } else {
        await crear(payload);
      }
      setMostrarModal(false);
      setFormulario(estadoInicialFormulario);
    } catch (err) {
      const mensaje = err.message || 'No se pudo guardar la sucursal.';
      setErrorFormulario(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const solicitarEliminar = (sucursal) => {
    setSucursalAEliminar(sucursal);
  };

  const cerrarModalEliminar = () => {
    if (eliminandoId) {
      return;
    }
    setSucursalAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!sucursalAEliminar) {
      return;
    }

    try {
      setErrorAccion(null);
      setEliminandoId(sucursalAEliminar.id_sucursal);
      await eliminar(sucursalAEliminar.id_sucursal);
      setSucursalAEliminar(null);
    } catch (err) {
      setErrorAccion(err.message || 'No se pudo eliminar la sucursal.');
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600"
      >
        Mostrando
        <span className="mx-1.5 inline-block font-bold text-primary">{sucursalesFiltradas.length}</span>
        de
        <span className="mx-1.5 inline-block font-bold text-primary">{sucursales.length}</span>
        <span className="inline-block">sucursales registradas.</span>
      </motion.div>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-container-low p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o dirección..."
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex w-full md:w-auto">
          <button
            onClick={abrirModalCrear}
            className="px-6 py-3 bg-linear-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-xl shadow-[0_4px_12px_rgba(0,81,71,0.25)] hover:shadow-[0_6px_20px_rgba(0,81,71,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva sucursal
          </button>
        </div>
      </motion.div>

      {(error || errorCiudades) && (
        <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
          {error || errorCiudades}
        </div>
      )}

      {errorAccion && (
        <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
          {errorAccion}
        </div>
      )}

      <SucursalTable
        cargando={cargando}
        sucursales={sucursalesFiltradas}
        mapaCiudades={mapaCiudades}
        onEditar={abrirModalEditar}
        onEliminar={solicitarEliminar}
        eliminandoId={eliminandoId}
      />

      <SucursalFormModal
        isOpen={mostrarModal}
        modoEdicion={modoEdicion}
        formulario={formulario}
        ciudades={ciudades}
        cargandoCiudades={cargandoCiudades}
        guardando={guardando}
        errorFormulario={errorFormulario}
        onClose={cerrarModal}
        onSubmit={manejarGuardar}
        onChange={manejarCambio}
      />

      <SucursalDeleteModal
        isOpen={Boolean(sucursalAEliminar)}
        sucursal={sucursalAEliminar}
        eliminando={Boolean(eliminandoId)}
        onClose={cerrarModalEliminar}
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
