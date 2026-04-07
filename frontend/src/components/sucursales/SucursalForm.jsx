import { useState, useEffect } from 'react';

const camposIniciales = { id_ciudad: '', nombre_sucursal: '', direccion: '' };

const SucursalForm = ({ sucursalEditar, onSubmit, onCancelar, cargando }) => {
  const [campos, setCampos] = useState(camposIniciales);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (sucursalEditar) {
      setCampos({
        id_ciudad: sucursalEditar.id_ciudad,
        nombre_sucursal: sucursalEditar.nombre_sucursal,
        direccion: sucursalEditar.direccion,
      });
    } else {
      setCampos(camposIniciales);
    }
    setErrores({});
  }, [sucursalEditar]);

  const validar = () => {
    const nuevosErrores = {};
    if (!campos.id_ciudad || isNaN(campos.id_ciudad) || campos.id_ciudad < 1)
      nuevosErrores.id_ciudad = 'Ingresa un ID de ciudad válido';
    if (!campos.nombre_sucursal.trim())
      nuevosErrores.nombre_sucursal = 'El nombre es requerido';
    if (!campos.direccion.trim())
      nuevosErrores.direccion = 'La dirección es requerida';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    onSubmit({ ...campos, id_ciudad: Number(campos.id_ciudad) });
  };

  const inputClass = (campo) =>
    `w-full px-3 py-2 rounded-lg border text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
      errores[campo] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID Ciudad
        </label>
        <input
          type="number"
          name="id_ciudad"
          value={campos.id_ciudad}
          onChange={handleChange}
          placeholder="Ej. 1"
          className={inputClass('id_ciudad')}
        />
        {errores.id_ciudad && (
          <p className="text-red-500 text-xs mt-1">{errores.id_ciudad}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la sucursal
        </label>
        <input
          type="text"
          name="nombre_sucursal"
          value={campos.nombre_sucursal}
          onChange={handleChange}
          placeholder="Ej. Sucursal Central"
          className={inputClass('nombre_sucursal')}
        />
        {errores.nombre_sucursal && (
          <p className="text-red-500 text-xs mt-1">{errores.nombre_sucursal}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <textarea
          name="direccion"
          value={campos.direccion}
          onChange={handleChange}
          placeholder="Ej. 4a Calle 2-30, Salamá"
          rows={2}
          className={inputClass('direccion')}
        />
        {errores.direccion && (
          <p className="text-red-500 text-xs mt-1">{errores.direccion}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={cargando}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          {cargando ? 'Guardando...' : sucursalEditar ? 'Guardar cambios' : 'Crear sucursal'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default SucursalForm;