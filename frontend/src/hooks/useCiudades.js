import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

const ordenarCiudades = (ciudades) => [...ciudades].sort((a, b) => (
  a.nombre_ciudad.localeCompare(b.nombre_ciudad)
));

const useCiudades = () => {
  const [ciudades, setCiudades] = useState([]);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);
  const [errorCiudades, setErrorCiudades] = useState(null);

  const obtenerCiudades = useCallback(async () => {
    setCargandoCiudades(true);
    setErrorCiudades(null);
    try {
      const { data } = await api.get('/ciudades');
      setCiudades(data);
      return data;
    } catch (err) {
      setErrorCiudades(err.response?.data?.mensaje || 'Error al cargar ciudades');
      return [];
    } finally {
      setCargandoCiudades(false);
    }
  }, []);

  useEffect(() => {
    obtenerCiudades();
  }, [obtenerCiudades]);

  const crear = async (payload) => {
    const { data } = await api.post('/ciudades', payload);
    setCiudades((prev) => ordenarCiudades([...prev, data]));
    return data;
  };

  const actualizar = async (id, payload) => {
    const { data } = await api.put(`/ciudades/${id}`, payload);
    setCiudades((prev) => ordenarCiudades(prev.map((ciudad) => (
      ciudad.id_ciudad === id ? data : ciudad
    ))));
    return data;
  };

  const eliminar = async (id) => {
    await api.delete(`/ciudades/${id}`);
    setCiudades((prev) => prev.filter((ciudad) => ciudad.id_ciudad !== id));
  };

  return {
    ciudades,
    cargandoCiudades,
    errorCiudades,
    refrescarCiudades: obtenerCiudades,
    crear,
    actualizar,
    eliminar,
  };
};

export default useCiudades;
