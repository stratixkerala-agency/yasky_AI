'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  Target, 
  PenTool, 
  Palette, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Users,
  Menu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AI_ROLES } from '@/lib/prompts';
import Card from '@/components/ui/Card';
import Sidebar from '@/components/layout/Sidebar';
import Spinner from '@/components/ui/Spinner';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roleCards = [
    {
      role: AI_ROLES[0],
      features: ['Cold Call Practice', 'Objection Handling', 'Script Training', 'Mock Simulations'],
      icon: Target,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      role: AI_ROLES[1],
      features: ['Meta Ads', 'Google Ads', 'CTA Generation', 'Hooks & Landing Pages'],
      icon: PenTool,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      role: AI_ROLES[2],
      features: ['Design Inspiration', 'Color Psychology', 'Layout Suggestions', 'Branding Advice'],
      icon: Palette,
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      role: AI_ROLES[3],
      features: ['SEO Blogs', 'Keyword Research', 'Meta Descriptions', 'Content Strategy'],
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Internal AI Platform</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Yasky AI</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl">
                Your AI-powered assistant platform for digital marketing excellence.
              </p>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl"
            >
              <Menu className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {roleCards.map(({ role, features, icon: Icon, gradient }) => (
              <Link key={role.id} href={`/chat/${role.id}`}>
                <Card hover glow className="p-5 sm:p-6 h-full group">
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}>
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {role.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mb-3 sm:mb-4 line-clamp-2">
                    {role.description}
                  </p>
                  <div className="space-y-1.5">
                    {features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="w-1 h-1 rounded-full bg-purple-500/50" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Team Access</h3>
                  <p className="text-sm text-zinc-500">Approved members only</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400">
                This platform is restricted to approved Stratix team members. All activity is monitored for security.
              </p>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI-Powered Platform</h3>
                  <p className="text-sm text-zinc-500">Advanced language model</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400">
                Each AI assistant is trained with specialized prompts tailored for digital marketing workflows.
              </p>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Real-time Processing</h3>
                  <p className="text-sm text-zinc-500">Instant responses</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400">
                Get immediate AI responses to help you with your daily tasks. No waiting, just productivity.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}