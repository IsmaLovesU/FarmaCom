import React from 'react';
import { UserCheck, UserX, Users } from 'lucide-react';
import SummaryCard from '../SummaryCard.jsx';

export default function UsuarioStatsGrid({ totalUsuarios, totalActivos, totalInactivos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        icon={Users}
        label="Total"
        value={String(totalUsuarios)}
        description="Usuarios registrados"
        colorClass="bg-primary"
        delay={0.1}
      />
      <SummaryCard
        icon={UserCheck}
        label="Activos"
        value={String(totalActivos)}
        description="Usuarios activos"
        colorClass="bg-green-500"
        delay={0.2}
      />
      <SummaryCard
        icon={UserX}
        label="Inactivos"
        value={String(totalInactivos)}
        description="Usuarios inactivos"
        colorClass="bg-red-500"
        delay={0.3}
      />
    </div>
  );
}
