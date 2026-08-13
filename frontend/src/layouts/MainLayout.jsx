import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';
import { Outlet, useLocation } from 'react-router-dom';

const ANCHO_ESCRITORIO = 768;
const CLAVE_PREFERENCIA_SIDEBAR = 'farmacom:sidebar-abierta';

const detectarEscritorio = () =>
  typeof window === 'undefined' || window.innerWidth >= ANCHO_ESCRITORIO;

const obtenerPreferenciaSidebar = () => {
  if (!detectarEscritorio()) {
    return false;
  }

  try {
    const preferenciaGuardada = window.localStorage.getItem(CLAVE_PREFERENCIA_SIDEBAR);
    return preferenciaGuardada === null ? true : preferenciaGuardada === 'true';
  } catch {
    return true;
  }
};

export default function MainLayout() {
  const location = useLocation();
  const [esEscritorio, setEsEscritorio] = useState(detectarEscritorio);
  const [sidebarAbierta, setSidebarAbierta] = useState(obtenerPreferenciaSidebar);

  useEffect(() => {
    const manejarCambioDeTamano = () => {
      const siguienteEsEscritorio = detectarEscritorio();

      if (siguienteEsEscritorio !== esEscritorio) {
        setEsEscritorio(siguienteEsEscritorio);
        setSidebarAbierta(
          siguienteEsEscritorio ? obtenerPreferenciaSidebar() : false,
        );
      }
    };

    window.addEventListener('resize', manejarCambioDeTamano);
    return () => window.removeEventListener('resize', manejarCambioDeTamano);
  }, [esEscritorio]);

  useEffect(() => {
    if (!esEscritorio) {
      setSidebarAbierta(false);
    }
  }, [esEscritorio, location.pathname]);

  useEffect(() => {
    if (!esEscritorio) {
      return;
    }

    try {
      window.localStorage.setItem(
        CLAVE_PREFERENCIA_SIDEBAR,
        String(sidebarAbierta),
      );
    } catch {
      // La Sidebar sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
  }, [esEscritorio, sidebarAbierta]);

  useEffect(() => {
    if (esEscritorio || !sidebarAbierta) {
      return undefined;
    }

    const manejarEscape = (event) => {
      if (event.key === 'Escape') {
        setSidebarAbierta(false);
      }
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', manejarEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', manejarEscape);
    };
  }, [esEscritorio, sidebarAbierta]);

  const abrirSidebar = () => {
    setSidebarAbierta(true);
  };

  const cerrarSidebar = () => {
    setSidebarAbierta(false);
  };

  const cerrarSidebarAlNavegar = () => {
    if (!esEscritorio) {
      cerrarSidebar();
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 medical-pattern pointer-events-none z-0"></div>
      
      <Sidebar
        abierta={sidebarAbierta}
        onCerrar={cerrarSidebar}
        onNavegar={cerrarSidebarAlNavegar}
      />

      {sidebarAbierta && !esEscritorio && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
          onClick={() => setSidebarAbierta(false)}
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] md:hidden"
        />
      )}
      
      <main
        className={`flex min-w-0 flex-1 flex-col relative z-10 transition-[margin] duration-300 ${
          sidebarAbierta ? 'md:ml-64' : 'md:ml-0'
        }`}
      >
        <TopNav sidebarAbierta={sidebarAbierta} onAbrirSidebar={abrirSidebar} />
        <div
          className={`mx-auto w-full min-w-0 p-4 sm:p-6 lg:p-8 ${
            sidebarAbierta && esEscritorio ? 'max-w-7xl' : 'max-w-none'
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
