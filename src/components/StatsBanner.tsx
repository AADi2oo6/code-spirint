'use client';

import React from 'react';
import { DollarSign, Flame, Users, CheckSquare, TrendingUp } from 'lucide-react';
import { PlatformStats } from '@/lib/types';

interface StatsBannerProps {
  stats: PlatformStats | null;
  loading: boolean;
}

export default function StatsBanner({ stats, loading }: StatsBannerProps) {
  const totalRaised = stats ? Number(stats.total_raised) : 0;
  const totalTarget = stats ? Number(stats.total_target) : 1;
  const overallPercent = Math.min(100, Math.round((totalRaised / (totalTarget || 1)) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Stat 1: Total Raised */}
      <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 border-b-2 border-l-2 border-black flex items-center justify-center">
          <DollarSign className="w-7 h-7 text-orange-600" />
        </div>
        <p className="text-[11px] font-mono font-bold tracking-wider text-neutral-500 uppercase mb-1">
          Total Capital Mobilized
        </p>
        <div className="text-3xl font-black text-black tracking-tight mb-2">
          {loading ? (
            <span className="inline-block w-24 h-8 bg-neutral-200 animate-pulse"></span>
          ) : (
            `$${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          )}
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600 mb-2">
          <span>Target: ${Number(stats?.total_target || 0).toLocaleString()}</span>
          <span className="font-bold text-orange-600">{overallPercent}% Funded</span>
        </div>
        <div className="w-full bg-neutral-200 h-2 border border-black">
          <div
            className="bg-orange-600 h-full transition-all duration-700 ease-out"
            style={{ width: `${overallPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Stat 2: Active Drives */}
      <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
        <div className="absolute top-0 right-0 w-16 h-16 bg-black flex items-center justify-center text-white">
          <Flame className="w-7 h-7 text-orange-400" />
        </div>
        <p className="text-[11px] font-mono font-bold tracking-wider text-neutral-500 uppercase mb-1">
          Active Relief Drives
        </p>
        <div className="text-3xl font-black text-black tracking-tight mb-2">
          {loading ? (
            <span className="inline-block w-16 h-8 bg-neutral-200 animate-pulse"></span>
          ) : (
            stats?.total_campaigns || 0
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-600">
          <span className="inline-block w-2 h-2 bg-emerald-500"></span>
          <span>100% verified NGO initiatives</span>
        </div>
      </div>

      {/* Stat 3: Mobilized Volunteers */}
      <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
        <div className="absolute top-0 right-0 w-16 h-16 bg-neutral-100 border-b-2 border-l-2 border-black flex items-center justify-center">
          <Users className="w-7 h-7 text-black" />
        </div>
        <p className="text-[11px] font-mono font-bold tracking-wider text-neutral-500 uppercase mb-1">
          Field Volunteers
        </p>
        <div className="text-3xl font-black text-black tracking-tight mb-2">
          {loading ? (
            <span className="inline-block w-16 h-8 bg-neutral-200 animate-pulse"></span>
          ) : (
            stats?.total_volunteers || 0
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-600">
          <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
          <span>On-ground emergency personnel</span>
        </div>
      </div>

      {/* Stat 4: Tasks Executed */}
      <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-600 flex items-center justify-center text-white">
          <CheckSquare className="w-7 h-7 text-white" />
        </div>
        <p className="text-[11px] font-mono font-bold tracking-wider text-neutral-500 uppercase mb-1">
          Tasks Completed
        </p>
        <div className="text-3xl font-black text-black tracking-tight mb-2">
          {loading ? (
            <span className="inline-block w-16 h-8 bg-neutral-200 animate-pulse"></span>
          ) : (
            `${stats?.completed_tasks || 0} / ${stats?.total_tasks || 0}`
          )}
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600">
          <span>Logistics & Triage</span>
          <span className="font-bold text-black">
            {stats && stats.total_tasks > 0
              ? `${Math.round(((stats.completed_tasks || 0) / stats.total_tasks) * 100)}% Complete`
              : '100%'}
          </span>
        </div>
      </div>
    </div>
  );
}
