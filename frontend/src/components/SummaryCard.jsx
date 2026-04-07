import React from 'react';
import { motion } from 'motion/react';

export default function SummaryCard({ icon: Icon, label, value, description, colorClass, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${colorClass} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-all duration-500`}></div>
      
      <div className="flex justify-between items-start">
        <span className={`p-2 rounded-xl ${colorClass} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </span>
        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-headline">{label}</span>
      </div>

      <div>
        <p className="text-4xl font-headline font-extrabold text-primary">{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-1">{description}</p>
      </div>
    </motion.div>
  );
}
