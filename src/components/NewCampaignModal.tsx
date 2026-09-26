'use client';

import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewCampaignModal({ isOpen, onClose, onSuccess }: NewCampaignModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Disaster Relief');
  const [targetAmount, setTargetAmount] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<'Normal' | 'High' | 'Critical'>('High');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const imagePresets = [
    {
      label: 'Flood & Disaster',
      url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Food Supplies',
      url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Winter Warmth',
      url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Medical Kit',
      url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !targetAmount || !location || !endDate) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          target_amount: parseFloat(targetAmount),
          location,
          urgency,
          beneficiaries_count: parseInt(beneficiaries) || 0,
          end_date: endDate,
          image_url: imageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to launch campaign');
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Launch New Donation & Relief Drive
            </span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
              Drive Title / Objective
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyclone Coastal Relief & Emergency Rations"
              className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              >
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Food & Hunger">Food & Hunger</option>
                <option value="Winter Relief">Winter Relief</option>
                <option value="Medical Aid">Medical Aid</option>
                <option value="Education">Education</option>
                <option value="Animal Rescue">Animal Rescue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'Normal' | 'High' | 'Critical')}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical (Immediate Deployment)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Target Funding Goal ($)
              </label>
              <input
                type="number"
                min="100"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="25000"
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Beneficiaries Count
              </label>
              <input
                type="number"
                value={beneficiaries}
                onChange={(e) => setBeneficiaries(e.target.value)}
                placeholder="e.g. 500 families"
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Geographic Location / Zone
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sector 7 Coastal Belt"
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Target Completion Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
              Field Description & Logistical Needs
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the operational goals, target demographic, materials needed, and coordination details."
              className="w-full bg-white border-2 border-black p-2.5 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            />
          </div>

          {/* Quick Image Selector */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
              Cover Image Preset
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {imagePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`p-1 border-2 border-black text-[10px] font-mono font-bold uppercase text-center transition-all ${
                    imageUrl === preset.url
                      ? 'bg-orange-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-neutral-100 text-black hover:bg-neutral-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or enter custom image URL"
              className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-sm uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-4 h-4" />
            {submitting ? 'COMMITTING TO SUPABASE...' : 'PUBLISH & ACTIVATE DRIVE'}
          </button>
        </form>
      </div>
    </div>
  );
}
