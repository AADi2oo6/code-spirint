'use client';

import React, { useState } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Campaign, Donation } from '@/lib/types';

interface DonationModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onDonationSuccess: () => void;
}

export default function DonationModal({ campaign, isOpen, onClose, onDonationSuccess }: DonationModalProps) {
  const [amount, setAmount] = useState<number | string>(50);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Donation | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !campaign) return null;

  const presetAmounts = [25, 50, 100, 250, 500];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    if (!donorName && !isAnonymous) return;
    if (!donorEmail) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaign.id,
          donor_name: isAnonymous ? 'Anonymous Donor' : donorName,
          donor_email: donorEmail,
          amount: Number(amount),
          payment_method: paymentMethod,
          message,
          is_anonymous: isAnonymous,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to record contribution');
      }

      const savedDonation = await res.json();
      setReceipt(savedDonation);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#000000', '#f97316', '#ffffff'],
        });
      } catch (cErr) {
        console.log('Confetti triggered');
      }

      onDonationSuccess();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error processing donation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTxn = () => {
    if (receipt?.transaction_id) {
      navigator.clipboard.writeText(receipt.transaction_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleModalClose = () => {
    setReceipt(null);
    setAmount(50);
    setDonorName('');
    setDonorEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-lg shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {receipt ? 'Official Donation Receipt' : 'Contribute To Drive'}
            </span>
          </div>
          <button
            onClick={handleModalClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt View or Form View */}
        {receipt ? (
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="text-center py-4 bg-orange-50 border-2 border-orange-600">
              <CheckCircle2 className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <h3 className="text-xl font-black text-black uppercase tracking-tight">Contribution Confirmed</h3>
              <p className="text-xs text-neutral-600 font-mono mt-1">Thank you for supporting emergency relief efforts!</p>
            </div>

            <div className="bg-neutral-50 p-4 border-2 border-black space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-neutral-300 pb-2">
                <span className="text-neutral-500">Transaction ID:</span>
                <div className="flex items-center gap-1 font-bold text-black">
                  <span>{receipt.transaction_id}</span>
                  <button onClick={handleCopyTxn} className="hover:text-orange-600">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between border-b border-neutral-300 pb-2">
                <span className="text-neutral-500">Campaign:</span>
                <span className="font-bold text-black text-right max-w-[200px] truncate">{campaign.title}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-300 pb-2">
                <span className="text-neutral-500">Amount Pledged:</span>
                <span className="text-base font-black text-orange-600">${Number(receipt.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-300 pb-2">
                <span className="text-neutral-500">Payment Gateway:</span>
                <span className="font-bold text-black">{receipt.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Donor Name:</span>
                <span className="font-bold text-black">{receipt.donor_name}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-100 border border-neutral-300 text-[11px] text-neutral-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>501(c)(3) verified non-profit pledge. Deductible for tax purposes.</span>
            </div>

            <button
              onClick={handleModalClose}
              className="w-full bg-black text-white hover:bg-neutral-800 font-mono font-bold text-xs uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]"
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="p-6 overflow-y-auto space-y-5">
            {/* Target Campaign Info */}
            <div className="bg-neutral-100 p-3 border-2 border-black">
              <span className="text-[10px] font-mono uppercase text-orange-600 font-bold block">Selected Drive</span>
              <p className="text-sm font-bold text-black">{campaign.title}</p>
              <div className="text-xs text-neutral-500 font-mono mt-0.5">{campaign.location}</div>
            </div>

            {/* Quick Amount Selectors */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-2">
                Select Contribution Amount ($)
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`py-2 text-xs font-mono font-black border-2 border-black transition-all ${
                      Number(amount) === preset
                        ? 'bg-orange-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono font-bold text-black">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Custom amount"
                  className="w-full bg-white border-2 border-black pl-8 pr-4 py-2 text-sm font-mono font-bold text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
                />
              </div>
            </div>

            {/* Donor Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                  Full Name {isAnonymous && '(Will be hidden)'}
                </label>
                <input
                  type="text"
                  required={!isAnonymous}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Card', 'UPI', 'Wire'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 text-xs font-mono font-bold border-2 border-black transition-all ${
                      paymentMethod === method
                        ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Message / Dedication */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Message of Encouragement (Optional)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Stay strong, team! Wishing a speedy recovery."
                className="w-full bg-white border-2 border-black p-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              />
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 border-2 border-black accent-orange-600"
              />
              <span className="text-xs font-mono text-neutral-700">
                Display as &quot;Anonymous Supporter&quot; on public ledger
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-sm uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              {submitting ? 'PROCESSING SECURE PLEDGE...' : `CONFIRM $${amount || 0} DONATION`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
