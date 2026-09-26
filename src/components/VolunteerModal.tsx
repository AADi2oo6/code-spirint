'use client';

import React, { useState } from 'react';
import { X, Users, CheckCircle, Shield } from 'lucide-react';
import { Campaign } from '@/lib/types';

interface VolunteerModalProps {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onVolunteerSuccess: () => void;
}

export default function VolunteerModal({
  campaigns,
  selectedCampaign,
  isOpen,
  onClose,
  onVolunteerSuccess,
}: VolunteerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState('Weekends & Evenings');
  const [campaignId, setCampaignId] = useState<string>(selectedCampaign ? String(selectedCampaign.id) : '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const availableSkills = [
    'Emergency First Aid',
    'Logistics & Fleet Transport',
    'Heavy Vehicle Driving',
    'Food Safety & Sorting',
    'Medical / Paramedic',
    'Counseling & Community Support',
    'Warehouse & Inventory',
    'Data Entry & Dispatch',
  ];

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || skills.length === 0) {
      alert('Please fill all fields and select at least one skill capability.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          skills: skills.join(', '),
          availability,
          campaign_id: campaignId ? Number(campaignId) : null,
        }),
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      setSuccess(true);
      onVolunteerSuccess();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error registering volunteer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setName('');
    setEmail('');
    setPhone('');
    setSkills([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-lg shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {success ? 'Volunteer Enlisted' : 'Volunteer Mobilization Form'}
            </span>
          </div>
          <button onClick={handleClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-black uppercase tracking-tight">
              Welcome to the Emergency Corps
            </h3>
            <p className="text-xs text-neutral-600 font-mono">
              Your profile has been registered in the Supabase volunteer roster. The on-ground NGO coordinator will assign emergency tasks to you shortly.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-black text-white hover:bg-neutral-800 font-mono font-bold text-xs uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            {/* Campaign Selection */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Assign to Emergency Drive
              </label>
              <select
                value={campaignId || (selectedCampaign ? String(selectedCampaign.id) : '')}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              >
                <option value="">General Relief Reserve (Any Drive)</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 012-3456"
                  className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@volunteer.org"
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              />
            </div>

            {/* Skills Badges Selection */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5">
                Skills & Capabilities (Select All That Apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableSkills.map((skill) => {
                  const selected = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-left text-[11px] font-mono px-2.5 py-1.5 border-2 border-black transition-all ${
                        selected
                          ? 'bg-orange-600 text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '} {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Availability Window
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              >
                <option value="Weekends & Evenings">Weekends & Evenings</option>
                <option value="Weekdays (Standard Hours)">Weekdays (Standard Hours)</option>
                <option value="Full Time (Emergency Response)">Full Time (Emergency Response)</option>
                <option value="On-Call Flexible Deployment">On-Call Flexible Deployment</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black hover:bg-neutral-900 text-white font-mono font-black text-sm uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Users className="w-4 h-4 text-orange-500" />
              {submitting ? 'ENLISTING VOLUNTEER...' : 'ENLIST AS EMERGENCY VOLUNTEER'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
