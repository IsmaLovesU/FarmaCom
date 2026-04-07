const SucursalCard = ({ sucursal, onEditar, onEliminar }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              Ciudad {sucursal.id_ciudad}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 truncate">
            {sucursal.nombre_sucursal}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {sucursal.direccion}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEditar(sucursal)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onEliminar(sucursal)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default SucursalCard;