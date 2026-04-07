import { useState } from 'react';
import useSucursales from '../../hooks/useSucursales';
import SucursalCard from '../../components/sucursales/SucursalCard';
import SucursalModal from '../../components/sucursales/SucursalModal';

const SucursalesPage = () => {
  const { sucursales, cargando, error, crear, actualizar, eliminar } = useSucursales();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [sucursalEditar, setSucursalEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const sucursalesFiltradas = sucursales.filter(s =>
    s.nombre_sucursal.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.direccion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirCrear = () => {
    setSucursalEditar(null);
    setErrorAccion(null);
    setModalAbierto(true);
  };

  const abrirEditar = (sucursal) => {
    setSucursalEditar(sucursal);
    setErrorAccion(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setSucursalEditar(null);
    setErrorAccion(null);
  };

  const handleSubmit = async (datos) => {
    setGuardando(true);
    setErrorAccion(null);
    try {
      if (sucursalEditar) {
        await actualizar(sucursalEditar.id_sucursal, datos);
      } else {
        await crear(datos);
      }
      cerrarModal();
    } catch (err) {
      setErrorAccion(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (sucursal) => {
    if (!confirm(`¿Eliminar "${sucursal.nombre_sucursal}"?`)) return;
    try {
      await eliminar(sucursal.id_sucursal);
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sucursales</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {sucursales.length} sucursal{sucursales.length !== 1 ? 'es' : ''} registrada{sucursales.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={abrirCrear}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Nueva sucursal
          </button>
        </div>

        {/* Búsqueda */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Error de carga */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {/* Error de acción */}
        {errorAccion && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
            {errorAccion}
          </div>
        )}

        {/* Contenido */}
        {cargando ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Cargando sucursales...
          </div>
        ) : sucursalesFiltradas.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {busqueda ? 'No hay resultados para esa búsqueda.' : 'Aún no hay sucursales registradas.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sucursalesFiltradas.map(s => (
              <SucursalCard
                key={s.id_sucursal}
                sucursal={s}
                onEditar={abrirEditar}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <SucursalModal
        abierto={modalAbierto}
        sucursalEditar={sucursalEditar}
        onSubmit={handleSubmit}
        onCerrar={cerrarModal}
        cargando={guardando}
      />
    </div>
  );
};

export default SucursalesPage;