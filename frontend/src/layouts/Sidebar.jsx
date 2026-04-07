import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Store, 
  Users, 
  BarChart3, 
  HelpCircle, 
  LogOut,
  Pill
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Inventario', path: '/inventario' },
  { icon: Store, label: 'Sucursales', path: '/sucursales' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
];

const bottomNavItems = [
  { icon: HelpCircle, label: 'Support', path: '/support' },
  { icon: LogOut, label: 'Logout', path: '/logout', isError: true },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-40 flex flex-col p-4 border-r border-slate-100 bg-slate-50/50 backdrop-blur-sm">
      <div className="mb-8 px-4 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
          <Pill className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-primary font-headline tracking-tighter leading-none">FarmaCom</h1>
          <p className="text-[10px] uppercase tracking-[0.1em] text-primary/60 font-bold mt-0.5">San Gabriel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-white shadow-sm border border-primary/5 text-primary font-bold' 
                : 'text-slate-600 hover:text-primary hover:bg-primary/5 font-medium'}
            `}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
            <span className="text-sm font-headline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200/50 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-primary hover:bg-primary/5 transition-all rounded-xl group font-medium"
          >
            <item.icon className={`w-5 h-5 ${item.isError ? 'text-error' : ''} transition-transform duration-300 group-hover:translate-x-1`} />
            <span className="text-sm font-headline">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
