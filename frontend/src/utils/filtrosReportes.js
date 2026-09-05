export const AGRUPACIONES_REPORTE = ['dia', 'semana', 'mes'];
export const CRITERIOS_TOP_PRODUCTOS = ['cantidad', 'ingresos'];

const formatearFechaInput = (fecha) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const esFechaInputValida = (valor) => {
  const coincidencia = String(valor ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!coincidencia) return false;

  const [, anio, mes, dia] = coincidencia;
  const fecha = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia)));

  return fecha.getUTCFullYear() === Number(anio)
    && fecha.getUTCMonth() === Number(mes) - 1
    && fecha.getUTCDate() === Number(dia);
};

export const crearFiltrosInicialesReporte = (fechaReferencia = new Date()) => {
  const fechaHasta = new Date(
    fechaReferencia.getFullYear(),
    fechaReferencia.getMonth(),
    fechaReferencia.getDate(),
  );
  const fechaDesde = new Date(fechaHasta);
  fechaDesde.setDate(fechaDesde.getDate() - 29);

  return {
    id_sucursal: '',
    fecha_desde: formatearFechaInput(fechaDesde),
    fecha_hasta: formatearFechaInput(fechaHasta),
    agrupacion: 'dia',
    criterio: 'cantidad',
    limite: 5,
  };
};

export const validarFiltrosReporte = (filtros = {}) => {
  if (!filtros.fecha_desde || !filtros.fecha_hasta) {
    return 'Selecciona una fecha inicial y una fecha final.';
  }

  if (!esFechaInputValida(filtros.fecha_desde) || !esFechaInputValida(filtros.fecha_hasta)) {
    return 'Ingresa un rango de fechas válido.';
  }

  if (filtros.fecha_desde > filtros.fecha_hasta) {
    return 'La fecha inicial no puede ser posterior a la fecha final.';
  }

  if (filtros.id_sucursal !== '' && (
    !Number.isInteger(Number(filtros.id_sucursal)) || Number(filtros.id_sucursal) < 1
  )) {
    return 'Selecciona una sucursal válida.';
  }

  if (!AGRUPACIONES_REPORTE.includes(filtros.agrupacion)) {
    return 'Selecciona una agrupación válida.';
  }

  if (!CRITERIOS_TOP_PRODUCTOS.includes(filtros.criterio)) {
    return 'Selecciona un criterio válido para los productos destacados.';
  }

  const limite = Number(filtros.limite);
  if (!Number.isInteger(limite) || limite < 1 || limite > 20) {
    return 'El límite de productos debe estar entre 1 y 20.';
  }

  return null;
};

export const prepararFiltrosReporte = (filtros) => ({
  ...filtros,
  id_sucursal: filtros.id_sucursal === '' ? '' : Number(filtros.id_sucursal),
  limite: Number(filtros.limite),
});
