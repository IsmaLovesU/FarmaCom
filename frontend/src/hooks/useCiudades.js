const CIUDADES_HARDCODEADAS = [
  { id_ciudad: 1, nombre_ciudad: 'Baja Verapaz' },
  { id_ciudad: 2, nombre_ciudad: 'Chiquimula' },
  { id_ciudad: 3, nombre_ciudad: 'Quetzaltenango' },
  { id_ciudad: 4, nombre_ciudad: 'Quiché' },
  { id_ciudad: 5, nombre_ciudad: 'Retalhuleu' },
];

const useCiudades = () => {
  const obtenerCiudades = async () => CIUDADES_HARDCODEADAS;

  return {
    ciudades: CIUDADES_HARDCODEADAS,
    cargandoCiudades: false,
    errorCiudades: null,
    refrescarCiudades: obtenerCiudades,
  };
};

export default useCiudades;
