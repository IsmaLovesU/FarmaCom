import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

function SelectFiltro({ label, value, onChange, children }) {
  return (
    <div className="relative min-w-[180px] flex-1">
      <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-surface-container-lowest border border-slate-200 rounded-xl py-2.5 px-3 pr-9 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer font-medium"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
}

export default function ProductoFilterPanel({ filtros, onFiltroChange, categorias, casas, proveedores, presentaciones }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface-container-low rounded-2xl p-4 flex flex-wrap gap-4 items-end border border-slate-200/60"
    >
      <SelectFiltro
        label="Categoría"
        value={filtros.id_categoria}
        onChange={(e) => onFiltroChange('id_categoria', e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id_categoria} value={c.id_categoria}>
            {c.nombre}
          </option>
        ))}
      </SelectFiltro>

      <SelectFiltro
        label="Casa Farmacéutica"
        value={filtros.id_casa}
        onChange={(e) => onFiltroChange('id_casa', e.target.value)}
      >
        <option value="">Todos los laboratorios</option>
        {casas.map((c) => (
          <option key={c.id_casa} value={c.id_casa}>
            {c.nombre}
          </option>
        ))}
      </SelectFiltro>

      <SelectFiltro
        label="Presentación"
        value={filtros.id_presentacion}
        onChange={(e) => onFiltroChange('id_presentacion', e.target.value)}
      >
        <option value="">Todas las presentaciones</option>
        {(presentaciones || []).map((p) => (
          <option key={p.id_presentacion} value={p.id_presentacion}>
            {p.nombre}
          </option>
        ))}
      </SelectFiltro>

      <SelectFiltro
        label="Proveedor"
        value={filtros.id_proveedor}
        onChange={(e) => onFiltroChange('id_proveedor', e.target.value)}
      >
        <option value="">Todos los proveedores</option>
        {proveedores.map((p) => (
          <option key={p.id_proveedor} value={p.id_proveedor}>
            {p.nombre}
          </option>
        ))}
      </SelectFiltro>

      <SelectFiltro
        label="Estado"
        value={filtros.activo}
        onChange={(e) => onFiltroChange('activo', e.target.value)}
      >
        <option value="">Todos</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </SelectFiltro>
    </motion.div>
  );
}