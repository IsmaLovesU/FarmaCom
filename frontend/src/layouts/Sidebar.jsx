import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ChevronDown,
  Layers,
  Tag,
  Truck,
  Warehouse,
  Store,
  MapPin,
  Users,
  UserCog,
  BarChart3,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { logout } from '../api/auth';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth, AUTH_ACTIONS } from '../context/AuthContext';

const inventarioSubItems = [
  { icon: Package, label: 'Productos', path: '/inventario/productos' },
  { icon: Layers, label: 'Lotes', path: '/inventario/lotes' },
  { icon: Warehouse, label: 'Inventario', path: '/inventario/stock' },
  { icon: Tag, label: 'Categorias', path: '/inventario/categorias' },
  { icon: Truck, label: 'Proveedores', path: '/inventario/proveedores' },
];

const sucursalSubItems = [
  { icon: Store, label: 'Sucursales', path: '/sucursales' },
  { icon: MapPin, label: 'Ciudades', path: '/ciudades' },
];

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: UserCog, label: 'Usuarios', path: '/usuarios', roles: ['dueno', 'administrador'] },
  { icon: Users, label: 'Clientes', path: '/patients' },
  { icon: BarChart3, label: 'Reportes', path: '/reports' },
];

const bottomNavItems = [
  { icon: HelpCircle, label: 'Ayuda', path: '/support' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch, usuario } = useAuth();

  const inventarioActivo = location.pathname.startsWith('/inventario');
  const [inventarioAbierto, setInventarioAbierto] = useState(inventarioActivo);
  const sucursalesActivo = location.pathname.startsWith('/sucursales') || location.pathname.startsWith('/ciudades');
  const [sucursalesAbierto, setSucursalesAbierto] = useState(sucursalesActivo);
  const puedeVerSucursales = ['dueno', 'administrador'].includes(usuario?.rol);

  const visibleNavItems = navItems.filter((item) => {
    if (item.path === '/dashboard') return false;
    if (!item.roles) return true;
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

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group ${
              isActive
                ? 'border border-primary/5 bg-white font-bold text-primary shadow-sm'
                : 'font-medium text-slate-600 hover:bg-primary/5 hover:text-primary'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-headline">Dashboard</span>
        </NavLink>

        {/* Inventario — ítem expandible */}
        <div>
          <button
            type="button"
            onClick={() => setInventarioAbierto((prev) => !prev)}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group ${
              inventarioActivo
                ? 'border border-primary/5 bg-white font-bold text-primary shadow-sm'
                : 'font-medium text-slate-600 hover:bg-primary/5 hover:text-primary'
            }`}
          >
            <Package className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
            <span className="text-sm font-headline flex-1 text-left">Inventario</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 flex-shrink-0 ${
                inventarioAbierto ? 'rotate-180' : ''
              } ${inventarioActivo ? 'text-primary' : 'text-slate-400'}`}
            />
          </button>

          {/* Sub-items */}
          {inventarioAbierto && (
            <div className="mt-1 ml-4 pl-3 border-l-2 border-primary/10 space-y-0.5">
              {inventarioSubItems.map(({ icon: Icon, label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/8 text-primary font-bold'
                        : 'text-slate-500 hover:bg-primary/5 hover:text-primary font-medium'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs font-headline">{label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {puedeVerSucursales && (
          <div>
            <button
              type="button"
              onClick={() => setSucursalesAbierto((prev) => !prev)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group ${
                sucursalesActivo
                  ? 'border border-primary/5 bg-white font-bold text-primary shadow-sm'
                  : 'font-medium text-slate-600 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <Store className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
              <span className="text-sm font-headline flex-1 text-left">Sucursales</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 flex-shrink-0 ${
                  sucursalesAbierto ? 'rotate-180' : ''
                } ${sucursalesActivo ? 'text-primary' : 'text-slate-400'}`}
              />
            </button>

            {sucursalesAbierto && (
              <div className="mt-1 ml-4 pl-3 border-l-2 border-primary/10 space-y-0.5">
                {sucursalSubItems.map(({ icon: Icon, label, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/8 text-primary font-bold'
                          : 'text-slate-500 hover:bg-primary/5 hover:text-primary font-medium'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-headline">{label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resto de ítems */}
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group ${
                isActive
                  ? 'border border-primary/5 bg-white font-bold text-primary shadow-sm'
                  : 'font-medium text-slate-600 hover:bg-primary/5 hover:text-primary'
              }`
            }
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
