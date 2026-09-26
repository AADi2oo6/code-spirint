'use client';

import React from 'react';
import { MapPin, Users, Calendar, AlertTriangle, ArrowUpRight, Heart, Shield } from 'lucide-react';
import { Campaign } from '@/lib/types';

interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
  onVolunteer: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign, onDonate, onVolunteer }: CampaignCardProps) {
  const raised = Number(campaign.raised_amount) || 0;
  const target = Number(campaign.target_amount) || 1;
  const percent = Math.min(100, Math.round((raised / target) * 100));

  // Urgency tag styling
  const urgencyBadges = {
    Critical: 'bg-red-600 text-white border-black',
    High: 'bg-orange-500 text-white border-black',
    Normal: 'bg-black text-white border-black',
  };

  const badgeClass = urgencyBadges[campaign.urgency as keyof typeof urgencyBadges] || urgencyBadges.Normal;

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] hover:-translate-y-1 transition-all flex flex-col justify-between">
      <div>
        {/* Card Header & Image */}
        <div className="relative h-48 w-full border-b-2 border-black overflow-hidden bg-neutral-100">
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
          />
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="bg-white text-black font-mono font-bold text-[10px] uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {campaign.category}
            </span>
            <span
              className={`font-mono font-bold text-[10px] uppercase px-2 py-0.5 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 ${badgeClass}`}
            >
              <AlertTriangle className="w-3 h-3" />
              {campaign.urgency}
            </span>
          </div>

          <div className="absolute bottom-2 right-2 bg-black text-white font-mono text-[10px] px-2 py-0.5 border border-white">
            {campaign.beneficiaries_count > 0 ? `${campaign.beneficiaries_count.toLocaleString()} Impacted` : 'Community Priority'}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 uppercase mb-2">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span className="truncate">{campaign.location}</span>
          </div>

          <h3 className="text-lg font-black text-black leading-snug tracking-tight mb-2 line-clamp-2">
            {campaign.title}
          </h3>

          <p className="text-xs text-neutral-600 line-clamp-3 mb-5 leading-relaxed">
            {campaign.description}
          </p>

          {/* Progress Section */}
          <div className="space-y-2 mb-4 bg-neutral-50 p-3 border-2 border-neutral-200">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xl font-black text-black tracking-tight">
                  ${raised.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-neutral-500 ml-1.5">
                  of ${target.toLocaleString()}
                </span>
              </div>
              <span className="text-xs font-mono font-black text-orange-600 bg-orange-100 px-2 py-0.5 border border-orange-300">
                {percent}%
              </span>
            </div>

            {/* Sharp Progress Bar */}
            <div className="w-full bg-neutral-200 h-2.5 border border-black overflow-hidden">
              <div
                className="bg-orange-600 h-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-black" />
                {campaign.volunteer_count || 0} Volunteers
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-orange-600" />
                {campaign.donation_count || 0} Pledges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => onDonate(campaign)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-xs uppercase py-2.5 px-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-1.5"
        >
          <Heart className="w-3.5 h-3.5 fill-white" />
          Donate
        </button>

        <button
          onClick={() => onVolunteer(campaign)}
          className="w-full bg-white hover:bg-neutral-100 text-black font-mono font-bold text-xs uppercase py-2.5 px-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-1.5"
        >
          <Users className="w-3.5 h-3.5" />
          Volunteer
        </button>
      </div>
    </div>
  );
}
