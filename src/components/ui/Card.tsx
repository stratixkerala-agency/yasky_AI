'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div
      className={`
        relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/60 rounded-2xl
        ${hover ? 'hover:border-zinc-700/80 hover:bg-zinc-800/40 transition-all duration-300 cursor-pointer' : ''}
        ${glow ? 'shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}