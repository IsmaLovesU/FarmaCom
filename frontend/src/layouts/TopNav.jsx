import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const { usuario } = useAuth();

  const initials = (usuario?.nombre_usuario || 'Usuario')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0])
    .join('')
    .toUpperCase();

  const currentDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-primary/5 bg-white/80 px-8 py-4 shadow-[0_12px_40px_rgba(0,81,71,0.04)] backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h2 className="font-headline text-lg font-extrabold tracking-tight text-primary">
          Sucursales de Farmacia
        </h2>
        <span className="h-4 w-[1px] bg-slate-200" />
        <span className="text-xs font-medium capitalize text-slate-500">{currentDate}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <button className="group relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50">
            <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-error" />
          </button>
          <button className="group rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50">
            <Settings className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
          <div className="text-right">
            <p className="text-xs font-bold leading-none text-primary">
              {usuario?.nombre_usuario || 'Usuario FarmaCom'}
            </p>
            <p className="mt-0.5 text-[10px] font-medium capitalize text-slate-500">
              {usuario?.rol || 'Operador'}
            </p>
          </div>
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/10 bg-primary/10 text-sm font-extrabold text-primary shadow-sm">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
