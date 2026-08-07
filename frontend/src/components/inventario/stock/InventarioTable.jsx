import React from 'react';
import { motion } from 'motion/react';
import { Warehouse } from 'lucide-react';
import InventarioProductoFila from './InventarioProductoFila.jsx';

function InventarioTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 bg-surface-container-low">
      <span className="col-span-1" />
      <span className="col-span-3">Producto</span>
      <span className="col-span-2">Categoría / Casa</span>
      <span className="col-span-2">Proveedor</span>
      <span className="col-span-2 text-right">Stock Total</span>
      <span className="col-span-1 text-center">Estado</span>
      <span className="col-span-1 text-center">Detalle</span>
    </div>
  );
}

export default function InventarioTable({
  cargando,
  productos,
  sucursalId,
  onEditarLote,
  onEliminarLote,
  lotesRefreshKey,
}) {
  if (cargando) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-surface-container-lowest border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <InventarioTableHeader />
        <div className="px-6 py-16 text-center">
          <Warehouse className="w-10 h-10 text-slate-200 mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-slate-400 font-medium">Cargando inventario...</p>
        </div>
      </motion.section>
    );
  }

  if (productos.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-surface-container-lowest border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <InventarioTableHeader />
        <div className="px-6 py-16 text-center">
          <Warehouse className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">
            No se encontraron productos con stock en esta sucursal.
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="bg-surface-container-lowest border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
    >
      <InventarioTableHeader />
      <div className="divide-y divide-slate-100">
        {productos.map((producto, idx) => (
          <motion.div
            key={producto.id_producto}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
          >
            <InventarioProductoFila
              producto={producto}
              sucursalId={sucursalId}
              onEditarLote={onEditarLote}
              onEliminarLote={onEliminarLote}
              lotesRefreshKey={lotesRefreshKey}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
