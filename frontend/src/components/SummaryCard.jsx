import React from 'react';
import { motion } from 'motion/react';

export default function SummaryCard({ icon: Icon, label, value, description, colorClass, delay = 0 }) {
  const toneMap = {
    'bg-primary': {
      glow: 'bg-primary',
      iconBg: 'bg-primary/10',
      iconText: 'text-primary',
    },
    'bg-green-500': {
      glow: 'bg-green-500',
      iconBg: 'bg-green-500/10',
      iconText: 'text-green-500',
    },
    'bg-red-500': {
      glow: 'bg-red-500',
      iconBg: 'bg-red-500/10',
      iconText: 'text-red-500',
    },
    'bg-amber-500': {
      glow: 'bg-amber-500',
      iconBg: 'bg-amber-500/10',
      iconText: 'text-amber-500',
    },
  };

  const tone = toneMap[colorClass] ?? {
    glow: colorClass,
    iconBg: 'bg-slate-200',
    iconText: 'text-slate-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${tone.glow} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-all duration-500`}></div>
      
      <div className="flex justify-between items-start">
        <span className={`p-2 rounded-xl ${tone.iconBg}`}>
          <Icon className={`w-5 h-5 ${tone.iconText}`} />
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
