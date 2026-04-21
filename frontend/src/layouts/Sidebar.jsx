import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Store,
  Users,
  UserCog,
  BarChart3,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { logout } from '../api/auth';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth, AUTH_ACTIONS } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Inventario', path: '/inventario' },
  { icon: Store, label: 'Sucursales', path: '/sucursales', roles: ['dueno', 'administrador'] },
  { icon: UserCog, label: 'Usuarios', path: '/usuarios', roles: ['dueno', 'administrador'] },
  { icon: Users, label: 'Clientes', path: '/patients' },
  { icon: BarChart3, label: 'Reportes', path: '/reports' },
];

const bottomNavItems = [
  { icon: HelpCircle, label: 'Ayuda', path: '/support' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { dispatch, usuario } = useAuth();

  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) {
      return true;
    }

    return item.roles.includes(usuario?.rol);
  });

  const handleLogout = async () => {
    try {
      await logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      navigate('/login', { replace: true });
    } catch (error) {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        navigate('/login', { replace: true });
        return;
      }

      window.alert(error.response?.data?.mensaje || 'No se pudo cerrar sesión. Intenta de nuevo.');
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-100 bg-slate-50/50 p-4 backdrop-blur-sm">
      <div className="mb-8 flex justify-center py-6">
        <BrandLogo subtitle="San Gabriel" centered />
      </div>

      <nav className="flex-1 space-y-1">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group
              ${isActive
                ? 'border border-primary/5 bg-white font-bold text-primary shadow-sm'
                : 'font-medium text-slate-600 hover:bg-primary/5 hover:text-primary'}
            `}
          >
            <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-headline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-slate-200/50 pt-6">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="group flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-primary/5 hover:text-primary"
          >
            <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="text-sm font-headline">{item.label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-600 transition-all hover:bg-primary/5 hover:text-primary"
        >
          <LogOut className="h-5 w-5 text-error transition-transform duration-300 group-hover:translate-x-1" />
          <span className="text-sm font-headline">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
