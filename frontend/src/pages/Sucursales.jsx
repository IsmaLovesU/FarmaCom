import React from 'react';
import { 
  Store, 
  ShieldCheck, 
  MapPin, 
  Search, 
  Filter, 
  PlusCircle, 
  AlertCircle,
  SearchX,
  MapPinned
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard.jsx';
import { motion } from 'motion/react';

export default function Sucursales() {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          icon={Store}
          label="Total"
          value="0"
          description="Sucursales registradas"
          colorClass="bg-primary"
          delay={0.1}
        />
        <SummaryCard 
          icon={ShieldCheck}
          label="Status"
          value="0"
          description="Activas actualmente"
          colorClass="bg-green-500"
          delay={0.2}
        />
        <SummaryCard 
          icon={MapPin}
          label="Cobertura"
          value="0"
          description="Ciudades presentes"
          colorClass="bg-blue-500"
          delay={0.3}
        />
      </div>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-container-low p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o dirección..."
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="px-6 py-3 bg-surface-container-lowest text-slate-700 font-headline font-bold text-sm rounded-xl border border-slate-200/50 hover:bg-white hover:shadow-md transition-all flex items-center gap-2 flex-1 md:flex-none justify-center">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-xl shadow-[0_4px_12px_rgba(0,81,71,0.25)] hover:shadow-[0_6px_20px_rgba(0,81,71,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 flex-1 md:flex-none justify-center">
            <PlusCircle className="w-4 h-4" />
            + Nueva sucursal
          </button>
        </div>
      </motion.div>

      {/* Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-error-container/30 border-l-4 border-error p-5 rounded-xl flex items-center gap-4 shadow-sm"
      >
        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-headline font-bold text-on-error-container">Atención del Sistema</h4>
          <p className="text-xs text-on-error-container/80 font-medium">No se han detectado sucursales activas en la base de datos centralizada. Por favor, verifique la conexión con el servidor regional.</p>
        </div>
        <button className="ml-auto text-xs font-bold text-error hover:underline uppercase tracking-wider font-headline">Ver detalles</button>
      </motion.div>

      {/* Empty State */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-surface-container-low/50 rounded-[2rem] min-h-[400px] flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200"
      >
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center relative z-10">
            <SearchX className="text-slate-300 w-16 h-16" />
          </div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center"
          >
            <MapPinned className="text-primary w-6 h-6" />
          </motion.div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
        </div>
        
        <h3 className="text-2xl font-headline font-extrabold text-primary mb-2">No hay sucursales que coincidan</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">
          Actualmente no existen registros que coincidan con los criterios de búsqueda o el inventario está vacío. Intenta ajustar los filtros o agrega una nueva sucursal para comenzar.
        </p>
        
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-white text-primary font-headline font-bold text-sm rounded-xl border border-primary/10 hover:bg-primary/5 transition-all">
            Limpiar búsqueda
          </button>
          <button className="px-8 py-3 bg-primary text-white font-headline font-bold text-sm rounded-xl shadow-md hover:bg-primary-container transition-all">
            Registrar primera sucursal
          </button>
        </div>
      </motion.div>

      {/* Background Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40">
        <div className="rounded-2xl overflow-hidden h-48 relative grayscale hover:grayscale-0 transition-all duration-700 group">
          <img 
            src="https://picsum.photos/seed/pharmacy/800/400" 
            alt="Pharmacy" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        <div className="rounded-2xl overflow-hidden h-48 relative grayscale hover:grayscale-0 transition-all duration-700 group">
          <img 
            src="https://picsum.photos/seed/map/800/400" 
            alt="Map" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
