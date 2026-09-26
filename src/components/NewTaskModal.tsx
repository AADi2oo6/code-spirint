'use client';

import React, { useState } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { Campaign, Volunteer } from '@/lib/types';

interface NewTaskModalProps {
  campaigns: Campaign[];
  volunteers: Volunteer[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewTaskModal({
  campaigns,
  volunteers,
  isOpen,
  onClose,
  onSuccess,
}: NewTaskModalProps) {
  const [campaignId, setCampaignId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignId || !title) {
      alert('Campaign and Task Title are mandatory.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: Number(campaignId),
          title,
          description,
          priority,
          assigned_to: assignedTo ? Number(assignedTo) : null,
          due_date: dueDate || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-lg shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-orange-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Dispatch Volunteer Field Task
            </span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
              Associated Emergency Campaign
            </label>
            <select
              required
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            >
              <option value="">Select campaign...</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
              Task Directive / Action Item
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Package & Load 300 Emergency Ration Kits"
              className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              >
                <option value="Critical">Critical (Immediate)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Assign to Volunteer
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              >
                <option value="">Unassigned (Open Dispatch)</option>
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.skills.slice(0, 25)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
              Instructions & Safety Protocols
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State assembly point, PPE gear requirements, contact person on-site, and reporting steps."
              className="w-full bg-white border-2 border-black p-2.5 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black hover:bg-neutral-800 text-white font-mono font-black text-sm uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
          >
            <CheckSquare className="w-4 h-4 text-orange-500" />
            {submitting ? 'DISPATCHING TASK...' : 'DISPATCH TASK TO FIELD'}
          </button>
        </form>
      </div>
    </div>
  );
}
