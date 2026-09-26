'use client';

import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Heart, Search, ExternalLink } from 'lucide-react';
import { Donation } from '@/lib/types';

interface TransparencyLedgerProps {
  donations: Donation[];
}

export default function TransparencyLedger({ donations }: TransparencyLedgerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = donations.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.donor_name.toLowerCase().includes(term) ||
      (d.campaign_title && d.campaign_title.toLowerCase().includes(term)) ||
      d.transaction_id.toLowerCase().includes(term)
    );
  });

  const totalFunds = donations.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
        <div>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-600" />
            Public Transparency & Contribution Ledger
          </h2>
          <p className="text-xs font-mono text-neutral-500">
            Real-time immutable log of all incoming financial support with verifiable transaction hashes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search donor, txn ID, or campaign..."
            className="w-full bg-white border-2 border-black pl-9 pr-3 py-1.5 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-100 border-b-2 border-black text-[11px] font-mono font-black uppercase text-black">
              <th className="p-3 border-r border-neutral-300">Transaction ID</th>
              <th className="p-3 border-r border-neutral-300">Donor Name</th>
              <th className="p-3 border-r border-neutral-300">Allocated Drive</th>
              <th className="p-3 border-r border-neutral-300">Amount</th>
              <th className="p-3 border-r border-neutral-300">Channel</th>
              <th className="p-3">Timestamp / Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-xs font-mono">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-400 uppercase font-mono">
                  No contributions found matching query
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="p-3 font-bold text-black border-r border-neutral-200 whitespace-nowrap">
                    <span className="bg-neutral-100 px-1.5 py-0.5 border border-black text-[10px]">
                      {d.transaction_id}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-black border-r border-neutral-200">
                    {d.is_anonymous ? (
                      <span className="italic text-neutral-500">Anonymous Supporter</span>
                    ) : (
                      d.donor_name
                    )}
                  </td>
                  <td className="p-3 text-neutral-700 border-r border-neutral-200 max-w-[220px] truncate">
                    {d.campaign_title || 'Emergency General Fund'}
                  </td>
                  <td className="p-3 font-black text-orange-600 border-r border-neutral-200 whitespace-nowrap text-sm">
                    ${Number(d.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-neutral-600 border-r border-neutral-200">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                      {d.payment_method}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-500">
                    <div className="flex flex-col">
                      <span>{new Date(d.created_at).toLocaleDateString()}</span>
                      {d.message && (
                        <span className="italic text-black text-[11px] truncate max-w-[250px]">
                          &quot;{d.message}&quot;
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
