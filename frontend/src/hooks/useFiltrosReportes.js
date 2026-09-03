import { useCallback, useState } from 'react';
import {
  crearFiltrosInicialesReporte,
  prepararFiltrosReporte,
  validarFiltrosReporte,
} from '../utils/filtrosReportes';

export default function useFiltrosReportes(fechaReferencia) {
  const [filtrosEdicion, setFiltrosEdicion] = useState(() => (
    crearFiltrosInicialesReporte(fechaReferencia)
  ));
  const [filtrosAplicados, setFiltrosAplicados] = useState(() => (
    prepararFiltrosReporte(crearFiltrosInicialesReporte(fechaReferencia))
  ));
  const [errorFiltros, setErrorFiltros] = useState(null);

  const actualizarFiltro = useCallback((campo, valor) => {
    setFiltrosEdicion((actuales) => ({
      ...actuales,
      [campo]: valor,
    }));
    setErrorFiltros(null);
  }, []);

  const aplicarFiltros = useCallback(() => {
    const mensajeError = validarFiltrosReporte(filtrosEdicion);

    if (mensajeError) {
      setErrorFiltros(mensajeError);
      return false;
    }

    setFiltrosAplicados(prepararFiltrosReporte(filtrosEdicion));
    setErrorFiltros(null);
    return true;
  }, [filtrosEdicion]);

  const restablecerFiltros = useCallback(() => {
    const filtrosIniciales = crearFiltrosInicialesReporte(fechaReferencia);
    setFiltrosEdicion(filtrosIniciales);
    setFiltrosAplicados(prepararFiltrosReporte(filtrosIniciales));
    setErrorFiltros(null);
  }, [fechaReferencia]);

  return {
    filtrosEdicion,
    filtrosAplicados,
    errorFiltros,
    actualizarFiltro,
    aplicarFiltros,
    restablecerFiltros,
  };
}
