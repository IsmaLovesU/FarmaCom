import React from 'react';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 medical-pattern pointer-events-none z-0"></div>
      
      <Sidebar />
      
      <main className="ml-64 flex-1 flex flex-col relative z-10">
        <TopNav />
        <div className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
