import React from 'react';
import { BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import ReporteFiltros from '../../components/reportes/ReporteFiltros.jsx';
import ResumenVentasGrid from '../../components/reportes/ResumenVentasGrid.jsx';
import useFiltrosReportes from '../../hooks/useFiltrosReportes.js';
import useReportes from '../../hooks/useReportes.js';
import useSucursales from '../../hooks/useSucursales.js';

export default function Reportes() {
  const {
    filtrosEdicion,
    filtrosAplicados,
    errorFiltros,
    actualizarFiltro,
    aplicarFiltros,
    restablecerFiltros,
  } = useFiltrosReportes();
  const { resumen, recargar } = useReportes(filtrosAplicados);
  const {
    sucursales,
    cargando: cargandoSucursales,
    error: errorSucursales,
  } = useSucursales();

  return (
    <section aria-labelledby="titulo-reportes" className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BarChart3 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1
          id="titulo-reportes"
          className="font-headline text-3xl font-extrabold tracking-tight text-primary"
        >
          Reportes
        </h1>
      </motion.header>

      <ReporteFiltros
        filtros={filtrosEdicion}
        sucursales={sucursales}
        cargandoSucursales={cargandoSucursales}
        errorSucursales={errorSucursales}
        errorFiltros={errorFiltros}
        onFiltroChange={actualizarFiltro}
        onAplicar={aplicarFiltros}
        onRestablecer={restablecerFiltros}
      />

      <ResumenVentasGrid
        datos={resumen.datos}
        cargando={resumen.cargando}
        error={resumen.error}
        onReintentar={recargar}
      />
    </section>
  );
}
