import React from 'react';
import { motion } from 'motion/react';

export default function ProductoStatsBanner({ totalFiltrados, totalProductos }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600"
    >
      Mostrando
      <span className="mx-1.5 inline-block font-bold text-primary">{totalFiltrados}</span>
      de
      <span className="mx-1.5 inline-block font-bold text-primary">{totalProductos}</span>
      <span className="inline-block">productos registrados.</span>
    </motion.div>
  );
}