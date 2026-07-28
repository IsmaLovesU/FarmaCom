import React, { useCallback, useState } from 'react';
import { Info, X } from 'lucide-react';
import CatalogoProductosPOS from '../../components/ventas/CatalogoProductosPOS';
import CarritoVenta from '../../components/ventas/CarritoVenta';
import VencimientoAvisoModal from '../../components/ventas/VencimientoAvisoModal';
import { useAuth } from '../../context/AuthContext';
import { useCarrito } from '../../context/CarritoContext';
import useCatalogoPOS from '../../hooks/useCatalogoPOS';
import useClientes from '../../hooks/useClientes';

export default function PuntoVenta() {
  const { sucursalActivaId } = useAuth();
  const {
    items,
    cantidadTotal,
    total,
    agregarAlCarrito,
    actualizarCantidad,
    incrementarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCarrito();
  const {
    productos,
    cargando,
    error,
    refrescar,
  } = useCatalogoPOS(sucursalActivaId);
  const { clientes, cargando: cargandoClientes } = useClientes();

  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [aviso, setAviso] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productoPendiente, setProductoPendiente] = useState(null);
  const [confirmandoVenta, setConfirmandoVenta] = useState(false);

  const agregarAlCarritoValidandoStock = useCallback((producto) => {
    const existente = items.find((item) => item.clave === producto.carritoKey);
    if (existente?.cantidad >= producto.stock_disponible) {
      setAviso(`No hay más existencias disponibles de ${producto.nombre_comercial}.`);
      return;
    }

    agregarAlCarrito(producto, { precioUnitario: producto.precio_venta });
    setAviso(null);
  }, [agregarAlCarrito, items]);

  const agregarProducto = useCallback((producto) => {
    if (producto.estado_vencimiento === 'proximo_a_vencer') {
      setProductoPendiente(producto);
      return;
    }

    agregarAlCarritoValidandoStock(producto);
  }, [agregarAlCarritoValidandoStock]);

  const confirmarAgregarPendiente = useCallback(() => {
    if (!productoPendiente) return;
    agregarAlCarritoValidandoStock(productoPendiente);
    setProductoPendiente(null);
  }, [productoPendiente, agregarAlCarritoValidandoStock]);

  const incrementarProducto = useCallback((item) => {
    if (item.cantidad >= item.stock_disponible) {
      setAviso(`Solo hay ${item.stock_disponible} unidades disponibles en este lote.`);
      return;
    }

    incrementarCantidad(item.clave);
    setAviso(null);
  }, [incrementarCantidad]);

  const disminuirProducto = useCallback((item) => {
    disminuirCantidad(item.clave);
    setAviso(null);
  }, [disminuirCantidad]);

  const actualizarCantidadProducto = useCallback((item, cantidad) => {
    const cantidadSolicitada = Number(cantidad);
    if (!Number.isFinite(cantidadSolicitada)) {
      setAviso('Ingresa una cantidad válida.');
      return;
    }

    const cantidadNormalizada = Math.max(
      0,
      Math.min(Math.floor(cantidadSolicitada), item.stock_disponible),
    );

    if (cantidadSolicitada > item.stock_disponible) {
      setAviso(`Solo hay ${item.stock_disponible} unidades disponibles en este lote.`);
    } else {
      setAviso(null);
    }

    actualizarCantidad(item.clave, cantidadNormalizada);
  }, [actualizarCantidad]);

  const eliminarProducto = useCallback((item) => {
    eliminarDelCarrito(item.clave);
    setAviso(null);
  }, [eliminarDelCarrito]);

  const itemsProximosAVencer = items.filter(
    (item) => item.estado_vencimiento === 'proximo_a_vencer',
  );

  const finalizarVenta = useCallback(() => {
    const nombreCliente = clienteSeleccionado?.nombre_cliente || 'Consumidor final';
    setAviso(
      `Cobro ${metodoPago} preparado para ${nombreCliente}. Falta conectar la confirmación con el endpoint de ventas.`,
    );
    setConfirmandoVenta(false);
  }, [clienteSeleccionado, metodoPago]);

  const procesarVenta = () => {
    if (itemsProximosAVencer.length > 0) {
      setConfirmandoVenta(true);
      return;
    }

    finalizarVenta();
  };

  return (
    <div className="space-y-4">
      {aviso && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
          <span className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            {aviso}
          </span>
          <button
            type="button"
            onClick={() => setAviso(null)}
            aria-label="Cerrar aviso"
            className="rounded-lg p-1 hover:bg-white/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid w-full items-stretch gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(390px,0.65fr)]">
        <CatalogoProductosPOS
          productos={productos}
          cargando={cargando}
          error={error}
          onAgregar={agregarProducto}
          onRefrescar={refrescar}
        />

        <CarritoVenta
          items={items}
          total={total}
          cantidadTotal={cantidadTotal}
          metodoPago={metodoPago}
          onMetodoPagoChange={setMetodoPago}
          clientes={clientes}
          cargandoClientes={cargandoClientes}
          clienteSeleccionado={clienteSeleccionado}
          onClienteChange={setClienteSeleccionado}
          onIncrementar={incrementarProducto}
          onDisminuir={disminuirProducto}
          onActualizarCantidad={actualizarCantidadProducto}
          onEliminar={eliminarProducto}
          onLimpiar={vaciarCarrito}
          onProcesar={procesarVenta}
        />
      </div>

      <VencimientoAvisoModal
        isOpen={Boolean(productoPendiente)}
        productos={productoPendiente ? [productoPendiente] : []}
        titulo="Producto próximo a vencer"
        mensaje="Este producto está próximo a vencer. ¿Deseas agregarlo de todas formas al carrito?"
        onClose={() => setProductoPendiente(null)}
        onConfirm={confirmarAgregarPendiente}
      />

      <VencimientoAvisoModal
        isOpen={confirmandoVenta}
        productos={itemsProximosAVencer}
        titulo="Venta con productos próximos a vencer"
        mensaje="El carrito incluye productos próximos a vencer. ¿Deseas continuar con la venta?"
        onClose={() => setConfirmandoVenta(false)}
        onConfirm={finalizarVenta}
      />
    </div>
  );
}
