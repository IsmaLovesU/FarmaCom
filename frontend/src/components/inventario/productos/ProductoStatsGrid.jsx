import React from 'react';
import { Package, PackageCheck, PackageX, AlertTriangle } from 'lucide-react';
import SummaryCard from '../../SummaryCard.jsx';

export default function ProductoStatsGrid({ totalProductos, totalActivos, totalInactivos, totalConAlertaMayoreo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <SummaryCard
        icon={Package}
        label="Total"
        value={String(totalProductos)}
        description="Productos en catálogo"
        colorClass="bg-primary"
        delay={0.05}
      />
      <SummaryCard
        icon={PackageCheck}
        label="Activos"
        value={String(totalActivos)}
        description="Productos disponibles"
        colorClass="bg-green-500"
        delay={0.1}
      />
      <SummaryCard
        icon={PackageX}
        label="Inactivos"
        value={String(totalInactivos)}
        description="Dados de baja"
        colorClass="bg-red-500"
        delay={0.15}
      />
      <SummaryCard
        icon={AlertTriangle}
        label="Con Mayoreo"
        value={String(totalConAlertaMayoreo)}
        description="Habilitados para precio mayoreo"
        colorClass="bg-amber-500"
        delay={0.2}
      />
    </div>
  );
}