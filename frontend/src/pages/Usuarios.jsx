import React, { useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Search, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import SummaryCard from '../components/SummaryCard.jsx';
import UsuarioTable from '../components/usuarios/UsuarioTable.jsx';
import UsuarioFormModal from '../components/usuarios/UsuarioFormModal.jsx';
import UsuarioEstadoModal from '../components/usuarios/UsuarioEstadoModal.jsx';
import useUsuarios from '../hooks/useUsuarios';
import useSucursales from '../hooks/useSucursales';

const estadoInicialFormulario = {
  nombre_usuario: '',
  correo_usuario: '',
  contrasena: '',
  rol: '',
  id_sucursal: '',
};

export default function Usuarios() {
  const { usuarios, cargando, error, crear, actualizar, cambiarEstado } = useUsuarios();
  const { sucursales, cargando: cargandoSucursales } = useSucursales();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstadoId, setCambiandoEstadoId] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [errorAccion, setErrorAccion] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(estadoInicialFormulario);

  // FIX: nombre de variable unificado (antes: usuarioAcambiarEstado con 'c' minúscula)
  const [usuarioACambiarEstado, setUsuarioACambiarEstado] = useState(null);

  const mapaSucursales = useMemo(() => {
    return sucursales.reduce((acc, s) => {
      acc[s.id_sucursal] = s.nombre_sucursal;
      return acc;
    }, {});
  }, [sucursales]);

  const usuariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return usuarios;
    return usuarios.filter((u) => {
      const nombre = u.nombre_usuario?.toLowerCase() || '';
      const correo = u.correo_usuario?.toLowerCase() || '';
      return nombre.includes(termino) || correo.includes(termino);
    });
  }, [busqueda, usuarios]);

  const totalActivos = useMemo(
    () => usuarios.filter((u) => u.estado_usuario === 'activo').length,
    [usuarios],
  );

  const totalInactivos = useMemo(
    () => usuarios.filter((u) => u.estado_usuario === 'inactivo').length,
    [usuarios],
  );

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setIdEditando(null);
    setFormulario(estadoInicialFormulario);
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (usuario) => {
    setModoEdicion(true);
    setIdEditando(usuario.id_usuario);
    setFormulario({
      nombre_usuario: usuario.nombre_usuario || '',
      correo_usuario: usuario.correo_usuario || '',
      contrasena: '',
      rol: usuario.rol || '',
      id_sucursal: String(usuario.id_sucursal || ''),
    });
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setMostrarModal(false);
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardar = async (evento) => {
    evento.preventDefault();
    setErrorFormulario(null);

    const nombre = formulario.nombre_usuario.trim();
    const correo = formulario.correo_usuario.trim();
    const rol = formulario.rol;
    const idSucursal = Number(formulario.id_sucursal);

    if (!nombre || !correo || !rol || !idSucursal) {
      setErrorFormulario('Completa todos los campos del formulario.');
      return;
    }

    if (nombre.length > 100) {
      setErrorFormulario('El nombre no puede superar los 100 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setErrorFormulario('El correo electrónico no tiene un formato válido.');
      return;
    }

    if (!modoEdicion && formulario.contrasena.trim().length < 6) {
      setErrorFormulario('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setGuardando(true);
      if (modoEdicion && idEditando) {
        await actualizar(idEditando, {
          nombre_usuario: nombre,
          correo_usuario: correo,
          rol,
          id_sucursal: idSucursal,
        });
      } else {
        await crear({
          nombre_usuario: nombre,
          correo_usuario: correo,
          contrasena: formulario.contrasena.trim(),
          rol,
          id_sucursal: idSucursal,
        });
      }
      setMostrarModal(false);
      setFormulario(estadoInicialFormulario);
    } catch (err) {
      setErrorFormulario(err.message || 'No se pudo guardar el usuario.');
    } finally {
      setGuardando(false);
    }
  };

  const solicitarCambioEstado = (usuario) => {
    setUsuarioACambiarEstado(usuario);
  };

  const cerrarModalEstado = () => {
    if (cambiandoEstadoId) return;
    setUsuarioACambiarEstado(null);
  };

  const confirmarCambioEstado = async () => {
    // FIX: variable corregida (antes era usuarioAambiarEstado con doble 'a')
    if (!usuarioACambiarEstado) return;

    const esActivo = usuarioACambiarEstado.estado_usuario === 'activo';
    const nuevoEstado = esActivo ? 'inactivo' : 'activo';

    try {
      setErrorAccion(null);
      setCambiandoEstadoId(usuarioACambiarEstado.id_usuario);
      await cambiarEstado(usuarioACambiarEstado.id_usuario, nuevoEstado);
      setUsuarioACambiarEstado(null);
    } catch (err) {
      setErrorAccion(err.message || 'No se pudo cambiar el estado del usuario.');
    } finally {
      setCambiandoEstadoId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          icon={Users}
          label="Total"
          value={String(usuarios.length)}
          description="Usuarios registrados"
          colorClass="bg-primary"
          delay={0.1}
        />
        <SummaryCard
          icon={UserCheck}
          label="Activos"
          value={String(totalActivos)}
          description="Usuarios activos"
          colorClass="bg-green-500"
          delay={0.2}
        />
        <SummaryCard
          icon={UserX}
          label="Inactivos"
          value={String(totalInactivos)}
          description="Usuarios inactivos"
          colorClass="bg-red-500"
          delay={0.3}
        />
      </div>

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
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex w-full md:w-auto">
          <button
            onClick={abrirModalCrear}
            className="px-6 py-3 bg-linear-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-xl shadow-[0_4px_12px_rgba(0,81,71,0.25)] hover:shadow-[0_6px_20px_rgba(0,81,71,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            Nuevo usuario
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
          {error}
        </div>
      )}

      {errorAccion && (
        <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
          {errorAccion}
        </div>
      )}

      <UsuarioTable
        cargando={cargando}
        usuarios={usuariosFiltrados}
        mapaSucursales={mapaSucursales}
        onEditar={abrirModalEditar}
        onCambiarEstado={solicitarCambioEstado}
        cambiandoEstadoId={cambiandoEstadoId}
      />

      <UsuarioFormModal
        isOpen={mostrarModal}
        modoEdicion={modoEdicion}
        formulario={formulario}
        sucursales={sucursales}
        cargandoSucursales={cargandoSucursales}
        guardando={guardando}
        errorFormulario={errorFormulario}
        onClose={cerrarModal}
        onSubmit={manejarGuardar}
        onChange={manejarCambio}
      />

      <UsuarioEstadoModal
        isOpen={Boolean(usuarioACambiarEstado)}
        usuario={usuarioACambiarEstado}
        cambiando={Boolean(cambiandoEstadoId)}
        onClose={cerrarModalEstado}
        onConfirm={confirmarCambioEstado}
      />
    </div>
  );
}