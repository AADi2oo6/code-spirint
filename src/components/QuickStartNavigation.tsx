'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  CreditCard, 
  Users, 
  CheckSquare, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  LogIn,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { User, Campaign } from '@/lib/types';

interface QuickStartNavigationProps {
  currentUser: User | null;
  campaignsCount: number;
  donationsCount: number;
  volunteersCount: number;
  tasksCount: number;
  onOpenNewCampaign: () => void;
  onOpenPayment: () => void;
  onOpenVolunteer: () => void;
  onOpenNewTask: () => void;
  onOpenAuth: () => void;
  onAutoLoginDemo: () => void;
  onOpenTutorial: () => void;
}

export default function QuickStartNavigation({
  currentUser,
  campaignsCount,
  donationsCount,
  volunteersCount,
  tasksCount,
  onOpenNewCampaign,
  onOpenPayment,
  onOpenVolunteer,
  onOpenNewTask,
  onOpenAuth,
  onAutoLoginDemo,
  onOpenTutorial,
}: QuickStartNavigationProps) {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 overflow-hidden">
      {/* Top Header of Guide */}
      <div className="bg-black text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="font-mono text-xs font-black uppercase tracking-wider">
            Quick Start Guide // How to Test & Use the Platform
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTutorial}
            className="text-[11px] font-mono text-orange-400 hover:text-white underline cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Tour</span>
          </button>
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-neutral-400 hover:text-white p-0.5"
            title={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Steps */}
      {!minimized && (
        <div className="p-4 bg-orange-50/40">
          {/* Demo account fast access bar if not logged in */}
          {!currentUser && (
            <div className="bg-white border-2 border-black p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]">
              <div>
                <span className="font-mono text-xs font-black text-black uppercase flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5 text-orange-600" />
                  Instant Sandbox Access:
                </span>
                <p className="text-[11px] font-mono text-neutral-600 mt-0.5">
                  Click to log in with the pre-approved <strong>Demo Account</strong> (<code>demo@reliefgrid.org</code>) to spend dummy funds & add campaigns.
                </p>
              </div>
              <button
                onClick={onAutoLoginDemo}
                className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-xs uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 flex items-center gap-1.5"
              >
                <span>⚡ Auto-Login Demo Account</span>
              </button>
            </div>
          )}

          {/* 4 Interactive Flow Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="bg-white border-2 border-black p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 bg-black text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    1
                  </span>
                  {campaignsCount > 0 ? (
                    <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {campaignsCount} Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400">Not started</span>
                  )}
                </div>
                <h4 className="font-mono font-bold text-xs uppercase text-black mb-1">
                  Create a Relief Drive
                </h4>
                <p className="text-[11px] font-mono text-neutral-600 leading-snug mb-3">
                  Set target funding, location, and urgency for emergency supplies.
                </p>
              </div>
              <button
                onClick={onOpenNewCampaign}
                className="w-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-[11px] uppercase py-1.5 border border-black flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-orange-500" />
                Launch Drive
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-2 border-black p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 bg-orange-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    2
                  </span>
                  {donationsCount > 0 ? (
                    <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {donationsCount} Pledges
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400">Sandbox Ready</span>
                  )}
                </div>
                <h4 className="font-mono font-bold text-xs uppercase text-black mb-1">
                  Spend & Donate
                </h4>
                <p className="text-[11px] font-mono text-neutral-600 leading-snug mb-3">
                  Simulate Card or UPI donations with instant tax receipts and confetti.
                </p>
              </div>
              <button
                onClick={onOpenPayment}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-[11px] uppercase py-1.5 border border-black flex items-center justify-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Donate / Spend
              </button>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-2 border-black p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 bg-black text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    3
                  </span>
                  {volunteersCount > 0 ? (
                    <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {volunteersCount} Enlisted
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400">Roster Empty</span>
                  )}
                </div>
                <h4 className="font-mono font-bold text-xs uppercase text-black mb-1">
                  Mobilize Volunteers
                </h4>
                <p className="text-[11px] font-mono text-neutral-600 leading-snug mb-3">
                  Register volunteer profiles with specialized skills and availability.
                </p>
              </div>
              <button
                onClick={onOpenVolunteer}
                className="w-full bg-white hover:bg-neutral-100 text-black font-mono font-bold text-[11px] uppercase py-1.5 border border-black flex items-center justify-center gap-1"
              >
                <Users className="w-3.5 h-3.5 text-orange-600" />
                Enlist Volunteer
              </button>
            </div>

            {/* Step 4 */}
            <div className="bg-white border-2 border-black p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 bg-black text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    4
                  </span>
                  {tasksCount > 0 ? (
                    <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {tasksCount} Tasks
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400">No Directives</span>
                  )}
                </div>
                <h4 className="font-mono font-bold text-xs uppercase text-black mb-1">
                  Dispatch Field Tasks
                </h4>
                <p className="text-[11px] font-mono text-neutral-600 leading-snug mb-3">
                  Assign logistical duties and advance lanes on the Kanban board.
                </p>
              </div>
              <button
                onClick={onOpenNewTask}
                className="w-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-[11px] uppercase py-1.5 border border-black flex items-center justify-center gap-1"
              >
                <CheckSquare className="w-3.5 h-3.5 text-orange-500" />
                Dispatch Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
