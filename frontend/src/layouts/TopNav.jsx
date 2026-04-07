import React from 'react';
import { Bell, Settings } from 'lucide-react';

export default function TopNav() {
  const currentDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="w-full sticky top-0 z-30 bg-white/80 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-primary/5 shadow-[0_12px_40px_rgba(0,81,71,0.04)]">
      <div className="flex items-center gap-4">
        <h2 className="font-headline font-extrabold text-primary tracking-tight text-lg">Sucursales de Farmacia</h2>
        <span className="h-4 w-[1px] bg-slate-200"></span>
        <span className="text-xs font-medium text-slate-500 capitalize">{currentDate}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-500 relative group">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-500 group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="text-right">
            <p className="text-xs font-bold text-primary leading-none">Dr. Andrés Martínez</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Doctor</p>
          </div>
          <div className="relative">
            <img
              src="https://picsum.photos/seed/doctor/100/100"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/10 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
