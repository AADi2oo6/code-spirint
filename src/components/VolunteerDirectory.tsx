'use client';

import React from 'react';
import { Users, Mail, Phone, Clock, Plus, Tag } from 'lucide-react';
import { Volunteer } from '@/lib/types';

interface VolunteerDirectoryProps {
  volunteers: Volunteer[];
  onOpenVolunteerModal: () => void;
}

export default function VolunteerDirectory({ volunteers, onOpenVolunteerModal }: VolunteerDirectoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
        <div>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Volunteer Mobilization Roster
          </h2>
          <p className="text-xs font-mono text-neutral-500">
            Verified ground volunteers, emergency skills, and contact directory.
          </p>
        </div>
        <button
          onClick={onOpenVolunteerModal}
          className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Enlist New Volunteer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.map((vol) => {
          const skillList = vol.skills ? vol.skills.split(',').map((s) => s.trim()) : [];

          return (
            <div
              key={vol.id}
              className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
            >
              <div>
                {/* Volunteer Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-black text-black leading-snug">{vol.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mt-0.5">
                      <Clock className="w-3 h-3 text-orange-600" />
                      <span>{vol.availability}</span>
                    </div>
                  </div>
                  <span className="bg-neutral-100 text-black font-mono font-bold text-[10px] uppercase px-2 py-0.5 border border-black">
                    Active
                  </span>
                </div>

                {/* Campaign Assigned */}
                <div className="bg-neutral-50 border border-neutral-200 p-2.5 mb-3 text-[11px] font-mono">
                  <span className="text-neutral-500 block text-[9px] uppercase">Assigned Drive:</span>
                  <span className="font-bold text-black truncate block">
                    {vol.campaign_title || 'General Relief Reserve'}
                  </span>
                </div>

                {/* Skills Badges */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1">
                    <Tag className="w-3 h-3 text-black" />
                    Specialized Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-neutral-100 hover:bg-orange-50 text-black border border-black text-[10px] font-mono font-bold px-2 py-0.5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="pt-3 border-t border-neutral-200 text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail className="w-3.5 h-3.5 text-black shrink-0" />
                  <a href={`mailto:${vol.email}`} className="hover:text-orange-600 truncate">
                    {vol.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <a href={`tel:${vol.phone}`} className="hover:text-black">
                    {vol.phone}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
