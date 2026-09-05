import React from 'react';
import { Bell, Menu, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopNav({ sidebarAbierta, onAbrirSidebar }) {
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
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-primary/5 bg-white/80 px-4 py-3 shadow-[0_12px_40px_rgba(0,81,71,0.04)] backdrop-blur-md sm:px-6 md:px-8 md:py-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="h-9 w-9 flex-shrink-0">
          {!sidebarAbierta && (
            <button
              type="button"
              onClick={onAbrirSidebar}
              aria-controls="sidebar-principal"
              aria-expanded="false"
              aria-label="Mostrar menú lateral"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 outline-none transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        <h2 className="truncate font-headline text-sm font-extrabold tracking-tight text-primary sm:text-lg">
          San Gabriel
        </h2>
        <span className="hidden h-4 w-[1px] bg-slate-200 lg:block" />
        <span className="hidden text-xs font-medium capitalize text-slate-500 lg:block">{currentDate}</span>
      </div>

      <div className="ml-2 flex flex-shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
        <div className="hidden gap-1 sm:flex sm:gap-2">
          <button type="button" aria-label="Ver notificaciones" className="group relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50">
            <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-error" />
          </button>
          <button type="button" aria-label="Abrir configuración" className="group rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50">
            <Settings className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-100 pl-2 sm:gap-3 sm:pl-4">
          <div className="hidden text-right md:block">
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
