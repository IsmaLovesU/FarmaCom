import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import InventarioSubNav from '../../components/inventario/InventarioSubNav.jsx';
import InventarioStatsCards from '../../components/inventario/stock/InventarioStatsCards.jsx';
import InventarioActionBar from '../../components/inventario/stock/InventarioActionBar.jsx';
import InventarioTable from '../../components/inventario/stock/InventarioTable.jsx';
import useInventarioSucursal from '../../hooks/useInventarioSucursal.js';
import useCategorias from '../../hooks/useCategorias.js';
import useSucursales from '../../hooks/useSucursales.js';
import { useAuth } from '../../context/AuthContext.jsx';

const FILTRO_TARJETA_A_ESTADO = {
  criticos: ['vencido', 'agotado'],
  proximos: ['proximo_a_vencer'],
  optimos:  ['normal'],
  total:    null,
};

const DETALLES_VISIBLES_POR_TARJETA = {
  criticos: ['', 'vencido', 'agotado'],
  total: ['', 'poco_stock'],
  default: ['', 'poco_stock'],
};

const detalleEsCompatible = (tarjeta, detalle) => {
  if (!detalle) {
    return true;
  }

  const opciones = DETALLES_VISIBLES_POR_TARJETA[tarjeta ?? 'default'] ?? DETALLES_VISIBLES_POR_TARJETA.default;
  return opciones.includes(detalle);
};

export default function InventarioSucursal() {
  const { sucursalActivaId } = useAuth();

  // Sucursal seleccionada - Empieza con la del usuario autenticado
  const [sucursalId, setSucursalId] = useState(sucursalActivaId);

  const { sucursales, cargando: cargandoSucursales } = useSucursales();
  const { categorias } = useCategorias();
  const {
    productos,
    resumen,
    cargando,
    error,
  } = useInventarioSucursal(sucursalId);

  // Filtros locales
  const [busqueda, setBusqueda] = useState('');
  const [filtroDetalle, setFiltroDetalle] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTarjeta, setFiltroTarjeta] = useState(null);

  // Al cambiar de sucursal, limpiar todos los filtros
  const handleSucursalChange = useCallback((id) => {
    setSucursalId(id);
    setBusqueda('');
    setFiltroDetalle('');
    setFiltroCategoria('');
    setFiltroTarjeta(null);
  }, []);

  // La tarjeta manda el grupo principal; el detalle solo refina cuando aplica.
  const handleFiltroTarjeta = useCallback((key) => {
    const siguienteTarjeta = filtroTarjeta === key ? null : key;
    setFiltroTarjeta(siguienteTarjeta);
    setFiltroDetalle((actual) => (
      detalleEsCompatible(siguienteTarjeta, actual) ? actual : ''
    ));
  }, [filtroTarjeta]);

  const handleFiltroDetalle = useCallback((valor) => {
    setFiltroDetalle(valor);
  }, []);

  //  Filtrado en memoria
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      // Búsqueda de texto
      const termino = busqueda.trim().toLowerCase();
      const coincideTexto =
        !termino ||
        p.nombre_comercial?.toLowerCase().includes(termino) ||
        p.nombre_generico?.toLowerCase().includes(termino) ||
        p.codigo?.toLowerCase().includes(termino);

      // Filtro de tarjeta
      let coincideEstado = true;
      if (filtroTarjeta && filtroTarjeta !== 'total') {
        const estadosPermitidos = FILTRO_TARJETA_A_ESTADO[filtroTarjeta];
        coincideEstado = estadosPermitidos
          ? estadosPermitidos.includes(p.estado_consolidado)
          : true;
      }

      if (coincideEstado && filtroDetalle) {
        coincideEstado = p.estado_consolidado === filtroDetalle;
      }

      // Filtro de categoría
      const coincideCategoria =
        !filtroCategoria ||
        String(p.id_categoria) === String(filtroCategoria);

      return coincideTexto && coincideEstado && coincideCategoria;
    });
  }, [productos, busqueda, filtroDetalle, filtroTarjeta, filtroCategoria]);

  //  Nombre de sucursal activa
  const nombreSucursal = useMemo(() => {
    if (!sucursales.length || !sucursalId) return '';
    return sucursales.find((s) => s.id_sucursal === sucursalId)?.nombre_sucursal ?? '';
  }, [sucursales, sucursalId]);

  // Render 
  return (
    <div className="space-y-6">
      <InventarioSubNav />

      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-primary">
            Inventario
          </h2>
          {nombreSucursal && (
            <p className="text-on-surface-variant mt-1 text-sm font-medium">
              Sucursal actual: {nombreSucursal}
            </p>
          )}
        </div>

        {/* Contador de resultados */}
        {!cargando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 hidden md:block"
          >
            Mostrando
            <span className="mx-1.5 font-bold text-primary">{productosFiltrados.length}</span>
            de
            <span className="mx-1.5 font-bold text-primary">{productos.length}</span>
            productos
          </motion.div>
        )}
      </motion.div>

      {/* Tarjetas resumen */}
      <InventarioStatsCards
        resumen={resumen}
        filtroActivo={filtroTarjeta}
        onFiltroChange={handleFiltroTarjeta}
        cargando={cargando}
      />

      {/* Barra de acción */}
      <InventarioActionBar
        busqueda={busqueda}
        onBusquedaChange={(e) => setBusqueda(e.target.value)}
        filtroDetalle={filtroDetalle}
        onFiltroDetalleChange={handleFiltroDetalle}
        tarjetaActiva={filtroTarjeta}
        filtroCategoria={filtroCategoria}
        onFiltroCategoriaChange={(v) => setFiltroCategoria(v)}
        categorias={categorias}
        sucursalId={sucursalId}
        sucursales={sucursales}
        onSucursalChange={handleSucursalChange}
        onNuevoLote={() => {
          // Próxima tarea Sprint 4: abrir modal de ingreso de lote
          // TODO: setMostrarModalLote(true)
          window.alert('Modal de ingreso de lote — próxima tarea del sprint');
        }}
      />

      {/* Error */}
      {error && (
        <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
          {error}
        </div>
      )}

      {/* Tabla */}
      <InventarioTable
        cargando={cargando}
        productos={productosFiltrados}
      />
    </div>
  );
}
