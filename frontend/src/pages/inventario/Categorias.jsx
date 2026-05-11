import React, { useMemo, useState } from 'react';
import InventarioSubNav from '../../components/inventario/InventarioSubNav.jsx';
import CategoriaActionBar from '../../components/inventario/categorias/CategoriaActionBar.jsx';
import CategoriaTable from '../../components/inventario/categorias/CategoriaTable.jsx';
import CategoriaFormModal from '../../components/inventario/categorias/CategoriaFormModal.jsx';
import CategoriaDeleteModal from '../../components/inventario/categorias/CategoriaDeleteModal.jsx';
import useCategorias from '../../hooks/useCategorias';

const formularioInicial = { nombre: '' };

export default function Categorias() {
  const { categorias, cargando, error, crear, actualizar, eliminar } = useCategorias();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [errorAccion, setErrorAccion] = useState(null);

  const categoriasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return categorias;
    return categorias.filter((c) => c.nombre.toLowerCase().includes(termino));
  }, [busqueda, categorias]);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setIdEditando(null);
    setFormulario(formularioInicial);
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (categoria) => {
    setModoEdicion(true);
    setIdEditando(categoria.id_categoria);
    setFormulario({ nombre: categoria.nombre });
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
      setErrorFormulario(err.response?.data?.mensaje || 'No se pudo guardar la categoría.');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!categoriaAEliminar) return;
    try {
      setErrorAccion(null);
      setEliminandoId(categoriaAEliminar.id_categoria);
      await eliminar(categoriaAEliminar.id_categoria);
      setCategoriaAEliminar(null);
    } catch (err) {
      setErrorAccion(err.response?.data?.mensaje || 'No se pudo eliminar la categoría.');
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <InventarioSubNav />

      <CategoriaActionBar
        busqueda={busqueda}
        onBusquedaChange={(e) => setBusqueda(e.target.value)}
        onCrear={abrirModalCrear}
      />

      {(error || errorAccion) && (
        <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
          {error || errorAccion}
        </div>
      )}

      <CategoriaTable
        cargando={cargando}
        categorias={categoriasFiltradas}
        onEditar={abrirModalEditar}
        onEliminar={setCategoriaAEliminar}
        eliminandoId={eliminandoId}
      />

      <CategoriaFormModal
        isOpen={mostrarModal}
        modoEdicion={modoEdicion}
        formulario={formulario}
        guardando={guardando}
        errorFormulario={errorFormulario}
        onClose={cerrarModal}
        onSubmit={manejarGuardar}
        onChange={manejarCambio}
      />

      <CategoriaDeleteModal
        isOpen={Boolean(categoriaAEliminar)}
        categoria={categoriaAEliminar}
        eliminando={Boolean(eliminandoId)}
        onClose={() => { if (!eliminandoId) setCategoriaAEliminar(null); }}
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
