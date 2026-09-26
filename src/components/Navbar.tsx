'use client';

import React from 'react';
import { ShieldCheck, Plus, Globe, Settings, Database } from 'lucide-react';

interface NavbarProps {
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  onOpenNewCampaign: () => void;
  onOpenNewTask: () => void;
  activeCampaignsCount: number;
}

export default function Navbar({
  viewMode,
  setViewMode,
  onOpenNewCampaign,
  onOpenNewTask,
  activeCampaignsCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
      {/* Top Banner Notice */}
      <div className="bg-black text-white text-[11px] font-mono tracking-wider px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-orange-500 animate-pulse-glow"></span>
          <span>RELIEFGRID SYSTEM v2.4 // REAL-TIME COORDINATION ENGINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-neutral-300">
          <span className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-orange-400" />
            Supabase Postgres Pooler Active
          </span>
          <span className="text-orange-400 font-bold">{activeCampaignsCount} Active Drives</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo - Sharp Geometric Brutalist Style */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[2.5]" strokeLinecap="square">
              <rect x="3" y="3" width="8" height="8" fill="#ffffff" stroke="none" />
              <rect x="13" y="13" width="8" height="8" fill="#ffffff" stroke="none" />
              <path d="M7 11v6h6" stroke="#ffffff" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-black uppercase">
                RELIEF<span className="text-orange-600">GRID</span>
              </span>
              <span className="bg-black text-white text-[9px] font-mono font-bold px-1.5 py-0.5 tracking-wider">
                NGO HUB
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-mono hidden sm:block">
              Donation Drives & Volunteer Coordination
            </p>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher */}
          <div className="flex border-2 border-black bg-neutral-100 p-0.5">
            <button
              onClick={() => setViewMode('public')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'public'
                  ? 'bg-black text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public</span> Portal
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'admin'
                  ? 'bg-orange-600 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">NGO</span> Command
            </button>
          </div>

          {/* Action Button */}
          {viewMode === 'admin' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNewTask}
                className="hidden md:flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-black border-2 border-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
              >
                <Plus className="w-3.5 h-3.5 text-orange-600" />
                Dispatch Task
              </button>
              <button
                onClick={onOpenNewCampaign}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white border-2 border-black px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span> Drive
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenNewCampaign}
              className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white border-2 border-black px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(234,88,12,1)] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Plus className="w-4 h-4 text-orange-500" />
              Start A Drive
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
