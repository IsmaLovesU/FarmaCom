import React, { useMemo, useState, useCallback } from 'react';
import InventarioSubNav from '../../components/inventario/InventarioSubNav.jsx';
import ProductoStatsGrid from '../../components/inventario/productos/ProductoStatsGrid.jsx';
import ProductoStatsBanner from '../../components/inventario/productos/ProductoStatsBanner.jsx';
import ProductoActionBar from '../../components/inventario/productos/ProductoActionBar.jsx';
import ProductoFilterPanel from '../../components/inventario/productos/ProductoFilterPanel.jsx';
import ProductoTable from '../../components/inventario/productos/ProductoTable.jsx';
import useProductos from '../../hooks/useProductos.js';
import useCategorias from '../../hooks/useCategorias.js';
import useCasas from '../../hooks/useCasas.js';
import useProveedores from '../../hooks/useProveedores.js';

const filtrosIniciales = {
  id_categoria: '',
  id_casa: '',
  id_proveedor: '',
  activo: '',
};

export default function Productos() {
  const { productos, cargando, error, cambiarEstado } = useProductos();
  const { categorias } = useCategorias();
  const { casas } = useCasas();
  const { proveedores } = useProveedores();

  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [cambiandoEstadoId, setCambiandoEstadoId] = useState(null);
  const [errorAccion, setErrorAccion] = useState(null);

  // TODO: el modal de crear/editar lo implementará otra persona.
  // Por ahora el botón "Nuevo producto" solo registra en consola.
  const handleCrear = useCallback(() => {
    // Modal pendiente de implementación
    console.info('[Productos] Abrir modal de nuevo producto');
  }, []);

  const handleEditar = useCallback((producto) => {
    // Modal pendiente de implementación
    console.info('[Productos] Abrir modal de edición para:', producto.id_producto);
  }, []);

  const handleCambiarEstado = useCallback(async (producto) => {
    setErrorAccion(null);
    try {
      setCambiandoEstadoId(producto.id_producto);
      await cambiarEstado(producto.id_producto, !producto.activo);
    } catch (err) {
      setErrorAccion(err.message || 'No se pudo cambiar el estado del producto.');
    } finally {
      setCambiandoEstadoId(null);
    }
  }, [cambiarEstado]);

  const onFiltroChange = useCallback((campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const termino = busqueda.trim().toLowerCase();

      const coincideBusqueda =
        !termino ||
        p.nombre_comercial?.toLowerCase().includes(termino) ||
        p.nombre_generico?.toLowerCase().includes(termino) ||
        p.codigo?.toLowerCase().includes(termino);

      const coincideCategoria =
        !filtros.id_categoria || String(p.id_categoria) === filtros.id_categoria;

      const coincideCasa =
        !filtros.id_casa || String(p.id_casa) === filtros.id_casa;

      const coincideProveedor =
        !filtros.id_proveedor || String(p.id_proveedor) === filtros.id_proveedor;

      const coincideActivo =
        filtros.activo === '' ||
        String(p.activo) === filtros.activo;

      return coincideBusqueda && coincideCategoria && coincideCasa && coincideProveedor && coincideActivo;
    });
  }, [productos, busqueda, filtros]);

  const totalActivos = useMemo(() => productos.filter((p) => p.activo).length, [productos]);
  const totalInactivos = useMemo(() => productos.filter((p) => !p.activo).length, [productos]);
  const totalConMayoreo = useMemo(() => productos.filter((p) => p.aplica_mayoreo).length, [productos]);

  return (
    <div className="space-y-6">
      {/* Sub-navegación entre Productos / Lotes / Inventario */}
      <InventarioSubNav />

      {/* Título de sección */}
      <div>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-primary">
          Catálogo de Productos
        </h2>
        {/* <p className="text-sm text-slate-500 mt-1">
          Gestión centralizada de medicamentos y suministros (datos maestros).
        </p> */}
      </div>

      {/* Tarjetas de resumen */}
      <ProductoStatsGrid
        totalProductos={productos.length}
        totalActivos={totalActivos}
        totalInactivos={totalInactivos}
        totalConAlertaMayoreo={totalConMayoreo}
      />

      {/* Barra de búsqueda + botón */}
      <ProductoActionBar
        busqueda={busqueda}
        onBusquedaChange={(e) => setBusqueda(e.target.value)}
        onCrear={handleCrear}
      />

      {/* Filtros avanzados */}
      <ProductoFilterPanel
        filtros={filtros}
        onFiltroChange={onFiltroChange}
        categorias={categorias}
        casas={casas}
        proveedores={proveedores}
      />

      {/* Banner de conteo */}
      <ProductoStatsBanner
        totalFiltrados={productosFiltrados.length}
        totalProductos={productos.length}
      />

      {/* Alertas */}
      {(error || errorAccion) && (
        <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
          {error || errorAccion}
        </div>
      )}

      {/* Tabla */}
      <ProductoTable
        cargando={cargando}
        productos={productosFiltrados}
        onEditar={handleEditar}
        onCambiarEstado={handleCambiarEstado}
        cambiandoEstadoId={cambiandoEstadoId}
      />
    </div>
  );
}