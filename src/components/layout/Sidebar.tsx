'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Target, 
  PenTool, 
  Palette, 
  TrendingUp, 
  LogOut,
  Sparkles,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AI_ROLES } from '@/lib/prompts';
import { cn } from '@/lib/utils';

const navItems: { id: string; label: string; icon: LucideIcon | (() => React.JSX.Element); href: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  ...AI_ROLES.map(role => ({
    id: role.id,
    label: role.name,
    icon: (() => <span className="text-lg">{role.icon}</span>) as unknown as LucideIcon,
    href: `/chat/${role.id}`
  }))
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800/60 flex flex-col z-50">
      <div className="p-6 border-b border-zinc-800/60">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl blur opacity-30" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Yasky AI</h1>
            <p className="text-xs text-zinc-500">Stratix Internal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-3 mb-2">
          AI Assistants
        </div>
        {navItems.slice(1).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isLucideIcon = item.id === 'dashboard';
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              )}
            >
              {isLucideIcon ? (
                (item.icon as LucideIcon)({ className: 'w-5 h-5' })
              ) : (
                (item.icon as () => React.JSX.Element)()
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800/60">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-600 rounded-full flex items-center justify-center text-sm font-medium text-zinc-300">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <div className="w-5 h-5 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </aside>
  );
}