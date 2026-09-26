'use client';

import { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Server, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

interface DbInfo {
  database_name: string;
  db_user: string;
  pg_version: string;
  server_time: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState<{ status: string; latencyMs?: number; info?: DbInfo; error?: string } | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/db-check');
      const data = await res.json();
      setDbData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reach API route';
      setDbData({ status: 'error', error: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5 fill-emerald-400/20" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight">CodeSprint</h1>
            <p className="text-xs text-slate-400">Next.js + Supabase Postgres Full Stack</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Vercel Ready
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Supabase Session Pooler Active
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Full-Stack Project Setup <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Live & Connected
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Your Next.js React frontend, serverless API routes, and Supabase PostgreSQL pooler are configured and ready for rapid sprint development.
          </p>
        </div>

        {/* Database Status Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                dbData?.status === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  Database Connection Status
                  {loading && <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />}
                </h3>
                <p className="text-xs text-slate-400">
                  Host: <code className="text-emerald-400">aws-0-ap-southeast-1.pooler.supabase.com:5432</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {dbData?.status === 'connected' ? (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Connected ({dbData.latencyMs}ms)
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {loading ? 'Connecting...' : 'Disconnected'}
                </div>
              )}
              <button
                onClick={checkConnection}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                title="Test Connection Again"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Database Details Grid */}
          {dbData?.status === 'connected' && dbData.info ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <span className="text-xs font-medium text-slate-400 block mb-1">Database Name</span>
                <span className="text-sm font-semibold text-slate-200">{dbData.info.database_name}</span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <span className="text-xs font-medium text-slate-400 block mb-1">User</span>
                <span className="text-sm font-semibold text-slate-200">{dbData.info.db_user}</span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <span className="text-xs font-medium text-slate-400 block mb-1">Round-trip Latency</span>
                <span className="text-sm font-semibold text-emerald-400">{dbData.latencyMs} ms</span>
              </div>
              <div className="sm:col-span-2 md:col-span-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <span className="text-xs font-medium text-slate-400 block mb-1">Engine Version</span>
                <span className="text-xs font-mono text-slate-300 break-all">{dbData.info.pg_version}</span>
              </div>
            </div>
          ) : (
            <div className="pt-6">
              {dbData?.error && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs font-mono">
                  {dbData.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Speed-Run Deployment Guide */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
              Local Dev
            </div>
            <p className="text-xs text-slate-400">
              Run <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">npm run dev</code> to preview on localhost:3000.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">2</span>
              Push to GitHub
            </div>
            <p className="text-xs text-slate-400">
              Commit code & push to your GitHub repository.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">3</span>
              Deploy on Vercel
            </div>
            <p className="text-xs text-slate-400">
              Import repo on Vercel and add <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">DATABASE_URL</code> to Environment Variables.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        CodeSprint Fast Deployment Stack • Supabase PostgreSQL • Next.js
      </footer>
    </main>
  );
}
