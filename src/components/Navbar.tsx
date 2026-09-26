'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Globe, 
  Settings, 
  Database, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  BookOpen, 
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { User } from '@/lib/types';

interface NavbarProps {
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  onOpenNewCampaign: () => void;
  onOpenNewTask: () => void;
  onOpenAuth: () => void;
  onOpenTutorial: () => void;
  onOpenPaymentPortal: () => void;
  currentUser: User | null;
  onLogout: () => void;
  activeCampaignsCount: number;
  emergencyAlert: string;
}

export default function Navbar({
  viewMode,
  setViewMode,
  onOpenNewCampaign,
  onOpenNewTask,
  onOpenAuth,
  onOpenTutorial,
  onOpenPaymentPortal,
  currentUser,
  onLogout,
  activeCampaignsCount,
  emergencyAlert,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
      {/* Emergency Broadcast Ticker (If active) */}
      {emergencyAlert && (
        <div className="bg-red-600 text-white text-xs font-mono font-bold px-4 py-1.5 flex items-center justify-between border-b-2 border-black animate-pulse">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
            <span className="truncate uppercase">{emergencyAlert}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider shrink-0 bg-black text-white px-1.5 py-0.5 ml-2">
            CRITICAL BROADCAST
          </span>
        </div>
      )}

      {/* Top Banner Notice */}
      <div className="bg-black text-white text-[11px] font-mono tracking-wider px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-orange-500 animate-pulse-glow"></span>
          <span>RELIEFGRID v2.4 // DISASTER RESPONSE PLATFORM</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-300">
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1 text-orange-400 hover:text-white transition-colors cursor-pointer"
          >
            <BookOpen className="w-3 h-3" />
            <span className="underline">Tutorial & Guide</span>
          </button>
          <span className="hidden md:flex items-center gap-1.5">
            <Database className="w-3 h-3 text-orange-400" />
            Supabase Active
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
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
          {/* Fast Payment Portal Trigger */}
          <button
            onClick={onOpenPaymentPortal}
            className="hidden sm:flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white border-2 border-black px-3 py-1.5 text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Donate Portal</span>
          </button>

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
              <span className="hidden md:inline">Public</span> Portal
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
              <span className="hidden md:inline">NGO</span> Command
            </button>
          </div>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-2 border-2 border-black bg-neutral-50 px-2.5 py-1">
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-mono font-bold text-black max-w-[100px] sm:max-w-[130px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono uppercase text-orange-600 font-bold">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1 hover:text-red-600 text-neutral-600 transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white border-2 border-black px-3 py-1.5 text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]"
            >
              <LogIn className="w-3.5 h-3.5 text-orange-500" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
