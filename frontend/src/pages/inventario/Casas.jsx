import React, { useMemo, useState } from 'react';
import InventarioSubNav from '../../components/inventario/InventarioSubNav.jsx';
import CasaActionBar from '../../components/inventario/casas/CasaActionBar.jsx';
import CasaTable from '../../components/inventario/casas/CasaTable.jsx';
import CasaFormModal from '../../components/inventario/casas/CasaFormModal.jsx';
import CasaDeleteModal from '../../components/inventario/casas/CasaDeleteModal.jsx';
import useCasas from '../../hooks/useCasas';

const formularioInicial = { nombre: '' };

export default function Casas() {
  const { casas, cargando, error, crear, actualizar, cambiarEstado, eliminar } = useCasas();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [casaAEliminar, setCasaAEliminar] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);
  const [errorAccion, setErrorAccion] = useState(null);

  const casasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return casas;
    return casas.filter((c) => c.nombre.toLowerCase().includes(termino));
  }, [busqueda, casas]);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setIdEditando(null);
    setFormulario(formularioInicial);
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (casa) => {
    setModoEdicion(true);
    setIdEditando(casa.id_casa);
    setFormulario({ nombre: casa.nombre });
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setMostrarModal(false);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardar = async (e) => {
    e.preventDefault();
    setErrorFormulario(null);
    const nombre = formulario.nombre.trim();
    if (!nombre) { setErrorFormulario('El nombre es requerido.'); return; }
    try {
      setGuardando(true);
      if (modoEdicion && idEditando) {
        await actualizar(idEditando, { nombre });
      } else {
        await crear({ nombre });
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
    } catch (err) {
      setErrorFormulario(err.response?.data?.mensaje || 'No se pudo guardar la casa farmacéutica.');
    } finally {
      setGuardando(false);
    }
  };

  const manejarCambiarEstado = async (casa) => {
    try {
      setErrorAccion(null);
      setProcesandoId(casa.id_casa);
      await cambiarEstado(casa.id_casa, !casa.activo);
    } catch (err) {
      setErrorAccion(err.response?.data?.mensaje || 'No se pudo cambiar el estado.');
    } finally {
      setProcesandoId(null);
    }
  };

  const confirmarEliminar = async () => {
    if (!casaAEliminar) return;
    try {
      setErrorAccion(null);
      setProcesandoId(casaAEliminar.id_casa);
      await eliminar(casaAEliminar.id_casa);
      setCasaAEliminar(null);
    } catch (err) {
      setErrorAccion(err.response?.data?.mensaje || 'No se pudo eliminar la casa farmacéutica.');
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <InventarioSubNav />

      <CasaActionBar
        busqueda={busqueda}
        onBusquedaChange={(e) => setBusqueda(e.target.value)}
        onCrear={abrirModalCrear}
      />

      {(error || errorAccion) && (
        <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
          {error || errorAccion}
        </div>
      )}

      <CasaTable
        cargando={cargando}
        casas={casasFiltradas}
        onEditar={abrirModalEditar}
        onCambiarEstado={manejarCambiarEstado}
        onEliminar={setCasaAEliminar}
        procesandoId={procesandoId}
      />

      <CasaFormModal
        isOpen={mostrarModal}
        modoEdicion={modoEdicion}
        formulario={formulario}
        guardando={guardando}
        errorFormulario={errorFormulario}
        onClose={cerrarModal}
        onSubmit={manejarGuardar}
        onChange={manejarCambio}
      />

      <CasaDeleteModal
        isOpen={Boolean(casaAEliminar)}
        casa={casaAEliminar}
        eliminando={Boolean(procesandoId)}
        onClose={() => { if (!procesandoId) setCasaAEliminar(null); }}
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
