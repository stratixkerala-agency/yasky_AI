'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      document.cookie = 'firebase-session=user; path=/; max-age=3600; SameSite=strict';
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err && typeof err === 'object' && 'code' in err) {
        const error = err as { code: string };
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
          setError('Invalid email or password');
        } else if (error.code === 'auth/user-disabled') {
          setError('Your account has been disabled');
        } else if (error.code === 'auth/network-request-failed') {
          setError('Network error. Please check your connection.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (err instanceof Error) {
        if (err.message.includes('Firebase not initialized')) {
          setError('Authentication service unavailable. Contact support.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl blur opacity-40" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Yasky AI</h1>
          <p className="text-zinc-500 mt-2">Stratix Internal AI Platform</p>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-white">Team Access</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                placeholder="team@stratix.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-600">
            Restricted to approved Stratix team members only
          </p>
        </div>
      </div>
    </div>
  );
}