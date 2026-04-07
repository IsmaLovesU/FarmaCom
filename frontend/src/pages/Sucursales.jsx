import React, { useMemo, useState } from 'react';
import { 
  Store, 
  ShieldCheck, 
  MapPin, 
  Search, 
  PlusCircle
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard.jsx';
import SucursalFormModal from '../components/sucursales/SucursalFormModal.jsx';
import SucursalTable from '../components/sucursales/SucursalTable.jsx';
import { motion } from 'motion/react';
import useSucursales from '../hooks/useSucursales';
import useCiudades from '../hooks/useCiudades';

const estadoInicialFormulario = {
  nombre_sucursal: '',
  direccion: '',
  id_ciudad: '',
};

export default function Sucursales() {
  const { sucursales, cargando, error, crear, actualizar } = useSucursales();
  const { ciudades, cargandoCiudades, errorCiudades } = useCiudades();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(estadoInicialFormulario);

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

  const ciudadesConSucursales = useMemo(() => {
    return new Set(sucursales.map((sucursal) => sucursal.id_ciudad)).size;
  }, [sucursales]);

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
      const mensaje = err.response?.data?.mensaje || 'No se pudo guardar la sucursal.';
      setErrorFormulario(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          icon={Store}
          label="Total"
          value={String(sucursales.length)}
          description="Sucursales registradas"
          colorClass="bg-primary"
          delay={0.1}
        />
        <SummaryCard 
          icon={ShieldCheck}
          label="Mostradas"
          value={String(sucursalesFiltradas.length)}
          description="Coinciden con la búsqueda"
          colorClass="bg-green-500"
          delay={0.2}
        />
        <SummaryCard 
          icon={MapPin}
          label="Cobertura"
          value={String(ciudadesConSucursales)}
          description="Ciudades presentes"
          colorClass="bg-blue-500"
          delay={0.3}
        />
      </div>

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

      <SucursalTable
        cargando={cargando}
        sucursales={sucursalesFiltradas}
        mapaCiudades={mapaCiudades}
        onEditar={abrirModalEditar}
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
    </div>
  );
}
