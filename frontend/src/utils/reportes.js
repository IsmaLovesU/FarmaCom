const FORMATO_MONEDA = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const FORMATO_NUMERO = new Intl.NumberFormat('es-GT');

const FORMATO_FECHA = new Intl.DateTimeFormat('es-GT', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

export const normalizarNumeroReporte = (valor, valorPredeterminado = 0) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : valorPredeterminado;
};

export const formatearMoneda = (valor) => (
  FORMATO_MONEDA.format(normalizarNumeroReporte(valor))
);

export const formatearNumero = (valor) => (
  FORMATO_NUMERO.format(normalizarNumeroReporte(valor))
);

export const formatearFechaReporte = (valor) => {
  if (!valor) return '—';

  const coincidencia = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!coincidencia) return '—';

  const [, anio, mes, dia] = coincidencia;
  const fecha = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia)));
  const esFechaValida = fecha.getUTCFullYear() === Number(anio)
    && fecha.getUTCMonth() === Number(mes) - 1
    && fecha.getUTCDate() === Number(dia);

  return esFechaValida ? FORMATO_FECHA.format(fecha) : '—';
};

export const normalizarResumenVentas = (resumen = {}) => ({
  ingresos_totales: normalizarNumeroReporte(resumen.ingresos_totales),
  total_ventas: normalizarNumeroReporte(resumen.total_ventas),
  ticket_promedio: normalizarNumeroReporte(resumen.ticket_promedio),
  unidades_vendidas: normalizarNumeroReporte(resumen.unidades_vendidas),
});

export const normalizarSerieVentas = (periodos) => (
  Array.isArray(periodos)
    ? periodos.map((periodo) => ({
      ...periodo,
      ingresos: normalizarNumeroReporte(periodo.ingresos),
      total_ventas: normalizarNumeroReporte(periodo.total_ventas),
      ticket_promedio: normalizarNumeroReporte(periodo.ticket_promedio),
      unidades_vendidas: normalizarNumeroReporte(periodo.unidades_vendidas),
    }))
    : []
);

export const normalizarMetodosPago = (metodos) => (
  Array.isArray(metodos)
    ? metodos.map((metodo) => ({
      ...metodo,
      total_ventas: normalizarNumeroReporte(metodo.total_ventas),
      ingresos: normalizarNumeroReporte(metodo.ingresos),
      porcentaje_ingresos: normalizarNumeroReporte(metodo.porcentaje_ingresos),
    }))
    : []
);

export const normalizarTopProductos = (productos) => (
  Array.isArray(productos)
    ? productos.map((producto) => ({
      ...producto,
      id_producto: normalizarNumeroReporte(producto.id_producto),
      cantidad_vendida: normalizarNumeroReporte(producto.cantidad_vendida),
      ingresos_generados: normalizarNumeroReporte(producto.ingresos_generados),
    }))
    : []
);
