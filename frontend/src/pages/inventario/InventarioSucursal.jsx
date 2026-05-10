import React from 'react';
import { Warehouse } from 'lucide-react';
import InventarioSubNav from '../../components/inventario/InventarioSubNav.jsx';

export default function InventarioSucursal() {
  return (
    <div className="space-y-6">
      <InventarioSubNav />
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
        <Warehouse className="w-12 h-12 text-slate-300" />
        <p className="font-headline text-2xl font-bold">Inventario por Sucursal</p>
        <p className="text-sm">Esta pantalla está en construcción.</p>
      </div>
    </div>
  );
}