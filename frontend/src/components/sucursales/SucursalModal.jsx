import SucursalForm from './SucursalForm';

const SucursalModal = ({ abierto, sucursalEditar, onSubmit, onCerrar, cargando }) => {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCerrar}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          {sucursalEditar ? 'Editar sucursal' : 'Nueva sucursal'}
        </h2>
        <SucursalForm
          sucursalEditar={sucursalEditar}
          onSubmit={onSubmit}
          onCancelar={onCerrar}
          cargando={cargando}
        />
      </div>
    </div>
  );
};

export default SucursalModal;