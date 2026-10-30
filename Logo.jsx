import React from 'react';
import { Sparkles, Cpu, Target } from 'lucide-react';

export default function Logo({ size = 'md', variant = 'dark', className = '' }) {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const textColor = variant === 'light' ? 'text-slate-900' : 'text-white';
  const subtextColor = variant === 'light' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`flex items-center space-x-3 group cursor-pointer ${className}`}>
      {/* Neural AI Icon Shield */}
      <div className={`${containerSizes[size]} bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300 flex-shrink-0 relative overflow-hidden`}>
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative z-10">
          <Sparkles className={`${iconSizes[size]} text-cyan-400 group-hover:rotate-12 transition-transform duration-300`} />
        </div>
        <div className="absolute inset-0 bg-blue-500/20 blur-sm animate-pulse" />
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center space-x-2">
          <span className={`font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] ${textColor} ${textSizes[size]}`}>
            SkillMatch <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">AI</span>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30 uppercase tracking-widest">
            PRO
          </span>
        </div>
        {size !== 'sm' && (
          <p className={`text-[10px] font-medium tracking-wide ${subtextColor}`}>
            Smart Job Finder & Career Matching Platform
          </p>
        )}
      </div>
    </div>
  );
}
