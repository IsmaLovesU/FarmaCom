import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);

  const alternarSidebar = () => {
    setSidebarAbierta((abierta) => !abierta);
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 medical-pattern pointer-events-none z-0"></div>
      
      <Sidebar abierta={sidebarAbierta} />
      
      <main
        className={`flex min-w-0 flex-1 flex-col relative z-10 transition-[margin] duration-300 ${
          sidebarAbierta ? 'ml-64' : 'ml-0'
        }`}
      >
        <TopNav sidebarAbierta={sidebarAbierta} onAlternarSidebar={alternarSidebar} />
        <div
          className={`mx-auto w-full min-w-0 p-8 ${
            sidebarAbierta ? 'max-w-7xl' : 'max-w-none'
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
