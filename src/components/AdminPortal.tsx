'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Trash2, 
  CheckCircle, 
  PauseCircle, 
  PlayCircle, 
  Download, 
  Plus, 
  Users, 
  Flame, 
  CheckSquare, 
  AlertTriangle,
  FileSpreadsheet,
  Megaphone
} from 'lucide-react';
import { Campaign, Volunteer, Task, Donation } from '@/lib/types';

interface AdminPortalProps {
  campaigns: Campaign[];
  volunteers: Volunteer[];
  tasks: Task[];
  donations: Donation[];
  onRefreshData: () => void;
  onOpenNewCampaign: () => void;
  onOpenNewTask: () => void;
  emergencyAlert: string;
  setEmergencyAlert: (msg: string) => void;
}

export default function AdminPortal({
  campaigns,
  volunteers,
  tasks,
  donations,
  onRefreshData,
  onOpenNewCampaign,
  onOpenNewTask,
  emergencyAlert,
  setEmergencyAlert,
}: AdminPortalProps) {
  const [activeSection, setActiveSection] = useState<'campaigns' | 'volunteers' | 'tasks' | 'settings'>('campaigns');
  const [alertInput, setAlertInput] = useState(emergencyAlert);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Update Campaign Status
  const handleUpdateCampaignStatus = async (id: number, newStatus: 'active' | 'paused' | 'completed') => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      onRefreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating campaign');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete campaign "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete campaign');
      onRefreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting campaign');
    }
  };

  // Update Volunteer Status
  const handleUpdateVolunteerStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/volunteers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update volunteer');
      onRefreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating volunteer');
    }
  };

  // Delete Volunteer
  const handleDeleteVolunteer = async (id: number, name: string) => {
    if (!confirm(`Remove volunteer "${name}" from directory?`)) return;
    try {
      const res = await fetch(`/api/volunteers?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete volunteer');
      onRefreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting volunteer');
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to cancel and delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      onRefreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting task');
    }
  };

  // Download CSV
  const handleDownloadCSV = () => {
    window.location.href = '/api/export/donations';
  };

  // Save Emergency Alert
  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setEmergencyAlert(alertInput);
    alert('Global emergency broadcast updated!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-black text-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-600 text-white font-mono font-bold text-[10px] uppercase px-2 py-0.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            DIRECTOR COMMAND LEVEL ACCESS
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            NGO Operation & Campaign Management Portal
          </h2>
          <p className="text-xs text-neutral-300 font-mono mt-1">
            Override campaign parameters, verify volunteer credentials, dispatch directives, and export audit files.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadCSV}
            className="bg-white hover:bg-neutral-100 text-black font-mono font-bold text-xs uppercase px-3.5 py-2 border-2 border-white shadow-[2px_2px_0px_0px_rgba(234,88,12,1)] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-orange-600" />
            Export CSV Ledger
          </button>
          <button
            onClick={onOpenNewCampaign}
            className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-xs uppercase px-3.5 py-2 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Drive
          </button>
        </div>
      </div>

      {/* Admin Nav Sub-tabs */}
      <div className="flex overflow-x-auto gap-2 border-b-2 border-black pb-2">
        <button
          onClick={() => setActiveSection('campaigns')}
          className={`flex items-center gap-1.5 px-4 py-2 font-mono font-bold text-xs uppercase border-2 transition-all ${
            activeSection === 'campaigns'
              ? 'bg-orange-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Campaigns ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveSection('volunteers')}
          className={`flex items-center gap-1.5 px-4 py-2 font-mono font-bold text-xs uppercase border-2 transition-all ${
            activeSection === 'volunteers'
              ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Volunteers ({volunteers.length})
        </button>

        <button
          onClick={() => setActiveSection('tasks')}
          className={`flex items-center gap-1.5 px-4 py-2 font-mono font-bold text-xs uppercase border-2 transition-all ${
            activeSection === 'tasks'
              ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Task Directives ({tasks.length})
        </button>

        <button
          onClick={() => setActiveSection('settings')}
          className={`flex items-center gap-1.5 px-4 py-2 font-mono font-bold text-xs uppercase border-2 transition-all ${
            activeSection === 'settings'
              ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          Broadcast Banner
        </button>
      </div>

      {/* SECTION 1: CAMPAIGN MANAGEMENT TABLE */}
      {activeSection === 'campaigns' && (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-neutral-100 border-b-2 border-black uppercase text-[10px] font-black text-black">
                <th className="p-3 border-r border-neutral-300">Campaign Title</th>
                <th className="p-3 border-r border-neutral-300">Category</th>
                <th className="p-3 border-r border-neutral-300">Raised / Target</th>
                <th className="p-3 border-r border-neutral-300">Urgency</th>
                <th className="p-3 border-r border-neutral-300">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-3 font-bold text-black border-r border-neutral-200 max-w-[200px]">
                    <div className="truncate">{camp.title}</div>
                    <span className="text-[10px] text-neutral-500 font-normal">{camp.location}</span>
                  </td>
                  <td className="p-3 border-r border-neutral-200">{camp.category}</td>
                  <td className="p-3 border-r border-neutral-200 whitespace-nowrap">
                    <span className="font-bold text-orange-600">${Number(camp.raised_amount).toLocaleString()}</span>
                    <span className="text-neutral-500"> / ${Number(camp.target_amount).toLocaleString()}</span>
                  </td>
                  <td className="p-3 border-r border-neutral-200">
                    <span className="bg-neutral-100 border border-black px-1.5 py-0.5 text-[10px] font-bold">
                      {camp.urgency}
                    </span>
                  </td>
                  <td className="p-3 border-r border-neutral-200">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                        camp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                          : camp.status === 'paused'
                          ? 'bg-amber-100 text-amber-800 border-amber-600'
                          : 'bg-neutral-200 text-neutral-800 border-black'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {camp.status !== 'active' ? (
                        <button
                          onClick={() => handleUpdateCampaignStatus(camp.id, 'active')}
                          className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-1 border border-black"
                          title="Activate Drive"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateCampaignStatus(camp.id, 'paused')}
                          className="bg-amber-500 text-white text-[10px] font-bold uppercase px-2 py-1 border border-black"
                          title="Pause Drive"
                        >
                          Pause
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteCampaign(camp.id, camp.title)}
                        className="text-red-600 hover:text-red-800 p-1 border border-red-300 hover:bg-red-50"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION 2: VOLUNTEER VERIFICATION ROSTER */}
      {activeSection === 'volunteers' && (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-neutral-100 border-b-2 border-black uppercase text-[10px] font-black text-black">
                <th className="p-3 border-r border-neutral-300">Volunteer Name</th>
                <th className="p-3 border-r border-neutral-300">Contact</th>
                <th className="p-3 border-r border-neutral-300">Skills</th>
                <th className="p-3 border-r border-neutral-300">Assigned Drive</th>
                <th className="p-3 border-r border-neutral-300">Status</th>
                <th className="p-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {volunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-3 font-bold text-black border-r border-neutral-200">
                    {vol.name}
                  </td>
                  <td className="p-3 border-r border-neutral-200">
                    <div>{vol.email}</div>
                    <span className="text-[10px] text-neutral-500">{vol.phone}</span>
                  </td>
                  <td className="p-3 border-r border-neutral-200 max-w-[180px] truncate">
                    {vol.skills}
                  </td>
                  <td className="p-3 border-r border-neutral-200 max-w-[160px] truncate">
                    {vol.campaign_title || 'General Reserve'}
                  </td>
                  <td className="p-3 border-r border-neutral-200">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                      {vol.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {vol.status !== 'verified' ? (
                        <button
                          onClick={() => handleUpdateVolunteerStatus(vol.id, 'verified')}
                          className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-1 border border-black"
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateVolunteerStatus(vol.id, 'active')}
                          className="bg-neutral-200 text-black text-[10px] font-bold uppercase px-2 py-1 border border-black"
                        >
                          Unverify
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteVolunteer(vol.id, vol.name)}
                        className="text-red-600 hover:text-red-800 p-1 border border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION 3: TASK DIRECTIVES */}
      {activeSection === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={onOpenNewTask}
              className="bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase px-3 py-1.5 border-2 border-black flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-orange-500" />
              Dispatch New Task
            </button>
          </div>

          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-black uppercase text-[10px] font-black text-black">
                  <th className="p-3 border-r border-neutral-300">Task Title</th>
                  <th className="p-3 border-r border-neutral-300">Drive</th>
                  <th className="p-3 border-r border-neutral-300">Assigned Personnel</th>
                  <th className="p-3 border-r border-neutral-300">Priority</th>
                  <th className="p-3 border-r border-neutral-300">Status</th>
                  <th className="p-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-black border-r border-neutral-200">
                      {task.title}
                    </td>
                    <td className="p-3 border-r border-neutral-200 max-w-[150px] truncate">
                      {task.campaign_title || 'General'}
                    </td>
                    <td className="p-3 border-r border-neutral-200">
                      {task.volunteer_name ? (
                        <span className="font-bold text-black">{task.volunteer_name}</span>
                      ) : (
                        <span className="text-neutral-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 border-r border-neutral-200">
                      <span className="bg-neutral-100 border border-black px-1.5 py-0.5 text-[10px] font-bold">
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 border-r border-neutral-200">
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800 p-1 border border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: GLOBAL EMERGENCY BROADCAST SETTINGS */}
      {activeSection === 'settings' && (
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-xl space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-black text-black uppercase font-mono">
              Global Emergency Site Broadcast
            </h3>
          </div>
          <p className="text-xs font-mono text-neutral-600">
            Publish a red-alert ticker across the top of every screen on the platform to notify donors and volunteers of urgent situational changes.
          </p>

          <form onSubmit={handleSaveAlert} className="space-y-3 pt-2">
            <textarea
              rows={3}
              value={alertInput}
              onChange={(e) => setAlertInput(e.target.value)}
              placeholder="e.g. FLASH ALERT: Category 4 Cyclone Warning Issued for Coastal Zones. Immediate volunteer mobilization in effect."
              className="w-full bg-neutral-50 border-2 border-black p-3 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Update Live Broadcast
              </button>
              {emergencyAlert && (
                <button
                  type="button"
                  onClick={() => {
                    setEmergencyAlert('');
                    setAlertInput('');
                  }}
                  className="bg-white hover:bg-neutral-100 text-black font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black"
                >
                  Clear Banner
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
