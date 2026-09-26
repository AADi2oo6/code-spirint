'use client';

import React, { useState } from 'react';
import { X, BookOpen, Compass, CreditCard, Users, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
}

export default function TutorialModal({ isOpen, onClose, onStartDemo }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Discover & Track Live Relief Drives',
      icon: Compass,
      subtitle: 'Real-time campaign monitoring replacing static spreadsheets.',
      content: (
        <div className="space-y-3 text-xs font-mono text-neutral-700 leading-relaxed">
          <p>
            Community organizations and NGOs publish emergency donation drives with precise target amounts, geographic zones, and urgency tiers (<strong>Critical</strong>, <strong>High</strong>, <strong>Normal</strong>).
          </p>
          <div className="bg-neutral-100 p-3 border-2 border-black space-y-1.5">
            <div className="flex items-center gap-2 text-black font-bold">
              <span className="w-2 h-2 bg-orange-600"></span>
              <span>Dynamic Progress Tracking:</span>
            </div>
            <p className="text-[11px] text-neutral-600">
              Each campaign card renders live funding percentage, dollars raised vs goal, and registered volunteers directly from Supabase PostgreSQL.
            </p>
          </div>
          <p className="text-[11px] text-neutral-500">
            Use the category filters (Disaster Relief, Food & Hunger, Winter Relief, Education) or search query to find active initiatives.
          </p>
        </div>
      ),
    },
    {
      title: '2. Realistic Dummy Payment Portal ("ReliefPay")',
      icon: CreditCard,
      subtitle: 'Simulate instant credit card, UPI QR, and bank wire pledges.',
      content: (
        <div className="space-y-3 text-xs font-mono text-neutral-700 leading-relaxed">
          <p>
            Pledging financial support is instantaneous. Click <strong>&quot;Donate&quot;</strong> on any campaign card to launch the interactive simulated payment gateway.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-orange-50 p-2.5 border border-orange-300">
              <span className="font-bold text-orange-950 block mb-0.5">Credit / Debit Card:</span>
              <span>Interactive card visual with test card generator & CVV simulation.</span>
            </div>
            <div className="bg-neutral-100 p-2.5 border border-neutral-300">
              <span className="font-bold text-black block mb-0.5">UPI & QR Code:</span>
              <span>Dynamic QR code scanner simulator with copyable VPA handle.</span>
            </div>
          </div>
          <p>
            Upon confirmation, the transaction updates the database atomically and generates a <strong>verified receipt</strong> with reference code and confetti celebration!
          </p>
        </div>
      ),
    },
    {
      title: '3. Volunteer Enlistment & Field Kanban Dispatch',
      icon: Users,
      subtitle: 'Onboarding emergency personnel and dispatching on-ground tasks.',
      content: (
        <div className="space-y-3 text-xs font-mono text-neutral-700 leading-relaxed">
          <p>
            Volunteers register with specialized capability tags (Emergency First Aid, Logistics, Food Safety, Heavy Driving) and availability windows.
          </p>
          <div className="bg-neutral-100 p-3 border-2 border-black space-y-1.5">
            <div className="flex items-center gap-2 text-black font-bold">
              <span className="w-2 h-2 bg-emerald-600"></span>
              <span>3-Lane Real-Time Kanban Board:</span>
            </div>
            <p className="text-[11px] text-neutral-600">
              Switch to the <strong>Volunteer Kanban</strong> tab to advance field operations from <code>To Do</code> ➔ <code>In Progress</code> ➔ <code>Completed</code> in 1 click.
            </p>
          </div>
          <p className="text-[11px] text-neutral-500">
            Coordinators can dispatch tasks with deadlines and direct personnel assignments.
          </p>
        </div>
      ),
    },
    {
      title: '4. NGO Command Center & Public Transparency Ledger',
      icon: ShieldCheck,
      subtitle: 'Complete administrative control & immutable audit records.',
      content: (
        <div className="space-y-3 text-xs font-mono text-neutral-700 leading-relaxed">
          <p>
            Switch to the <strong>NGO Command Portal</strong> using the header toggle or logging in with an Admin account (<code>admin@reliefgrid.org</code>).
          </p>
          <div className="bg-black text-white p-3 border-2 border-black space-y-1.5">
            <span className="text-orange-400 font-bold block text-[11px] uppercase">
              Admin Governance Capabilities:
            </span>
            <ul className="list-disc pl-4 text-[11px] text-neutral-300 space-y-1">
              <li>Edit campaign target amounts, pause or complete drives, or delete them.</li>
              <li>Verify volunteer credentials and toggle active status.</li>
              <li>Download full financial contribution ledger as <strong>CSV spreadsheet</strong>.</li>
            </ul>
          </div>
          <p>
            The <strong>Public Ledger</strong> tab allows any citizen or auditor to inspect live contributions and transaction hashes.
          </p>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Platform Walkthrough // Full User Guide
            </span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="grid grid-cols-4 border-b-2 border-black bg-neutral-100">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`py-2 text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1 border-r last:border-r-0 border-black ${
                currentStep === idx
                  ? 'bg-orange-600 text-white'
                  : idx < currentStep
                  ? 'bg-neutral-200 text-black'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
              }`}
            >
              <span>{idx + 1}</span>
              <span className="hidden sm:inline">{idx === 0 ? 'Drives' : idx === 1 ? 'Payments' : idx === 2 ? 'Volunteers' : 'Admin'}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-start gap-3 pb-3 border-b-2 border-neutral-200">
            <div className="w-10 h-10 bg-orange-100 border-2 border-black flex items-center justify-center text-orange-600 shrink-0">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-black uppercase tracking-tight">{current.title}</h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <div className="py-2">{current.content}</div>
        </div>

        {/* Navigation Footer */}
        <div className="p-4 bg-neutral-100 border-t-2 border-black flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 border-black bg-white hover:bg-neutral-50 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          <span className="text-xs font-mono text-neutral-500">
            Step {currentStep + 1} of {steps.length}
          </span>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-mono font-bold uppercase border-2 border-black bg-black text-white hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onStartDemo();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-black uppercase border-2 border-black bg-orange-600 text-white hover:bg-orange-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Start Exploring
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
