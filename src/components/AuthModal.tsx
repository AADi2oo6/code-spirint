'use client';

import React, { useState } from 'react';
import { X, Lock, User as UserIcon, Mail, Phone, Building, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { User } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<'donor' | 'volunteer' | 'admin'>('donor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Fast Demo 1-Click Logins for Evaluators & Judges
  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      onAuthSuccess(data.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload =
      tab === 'login'
        ? { email, password }
        : { name, email, password, role, phone, organization };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      onAuthSuccess(data.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-md shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {tab === 'login' ? 'Identity Authentication' : 'Create System Account'}
            </span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b-2 border-black bg-neutral-100">
          <button
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`py-2.5 text-xs font-mono font-black uppercase transition-all ${
              tab === 'login'
                ? 'bg-white text-black border-r-2 border-black'
                : 'text-neutral-500 hover:text-black border-r-2 border-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`py-2.5 text-xs font-mono font-black uppercase transition-all ${
              tab === 'register' ? 'bg-white text-black' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Quick Demo Switcher for fast evaluation */}
        <div className="bg-orange-50 border-b-2 border-black p-3 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-orange-800">
            <span>⚡ Fast Evaluator 1-Click Access:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@reliefgrid.org', 'admin123')}
              className="bg-black hover:bg-neutral-800 text-white font-mono font-bold text-[9px] uppercase py-1.5 px-1 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center"
            >
              NGO Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('volunteer@relief.org', 'volunteer123')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-[9px] uppercase py-1.5 px-1 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center"
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('donor@gmail.com', 'donor123')}
              className="bg-white hover:bg-neutral-100 text-black font-mono font-bold text-[9px] uppercase py-1.5 px-1 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center"
            >
              Donor
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5">
          {error && (
            <div className="bg-red-50 border-2 border-red-600 p-2.5 text-xs font-mono text-red-700">
              {error}
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-black mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Captain Samantha Reed"
                className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-black mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@reliefgrid.org"
              className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-black mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            />
          </div>

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-black mb-1">
                  Platform Role
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['donor', 'volunteer', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-1.5 text-[10px] font-mono font-bold uppercase border-2 border-black transition-all ${
                        role === r
                          ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]'
                          : 'bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-black mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full bg-white border-2 border-black px-2.5 py-1 text-xs font-mono text-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-black mb-1">
                    Org / Affiliation
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Red Cross"
                    className="w-full bg-white border-2 border-black px-2.5 py-1 text-xs font-mono text-black"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-xs uppercase py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'AUTHENTICATING...' : tab === 'login' ? 'SIGN IN TO RELIEFGRID' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
}
