'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Copy, 
  Check, 
  Sparkles,
  Smartphone,
  RefreshCw,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Campaign, Donation, User } from '@/lib/types';

interface DummyPaymentPortalProps {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function DummyPaymentPortal({
  campaigns,
  selectedCampaign,
  currentUser,
  isOpen,
  onClose,
  onPaymentSuccess,
}: DummyPaymentPortalProps) {
  // Campaign & Amount
  const [campaignId, setCampaignId] = useState<string>(selectedCampaign ? String(selectedCampaign.id) : '');
  const [amount, setAmount] = useState<number | string>(100);

  // Donor Info
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');

  // Payment Channel: 'card' | 'upi' | 'netbanking'
  const [paymentChannel, setPaymentChannel] = useState<'card' | 'upi' | 'netbanking'>('card');

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'ALEX J MORGAN');

  // NetBanking bank
  const [selectedBank, setSelectedBank] = useState('Chase Bank (USA)');

  // Gateway Simulation State: 'form' | 'processing' | 'success'
  const [gatewayState, setGatewayState] = useState<'form' | 'processing' | 'success'>('form');
  const [processingStage, setProcessingStage] = useState(0);
  const [receipt, setReceipt] = useState<Donation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedCampaign) setCampaignId(String(selectedCampaign.id));
    if (currentUser) {
      if (!donorName) setDonorName(currentUser.name);
      if (!donorEmail) setDonorEmail(currentUser.email);
      setCardHolder(currentUser.name.toUpperCase());
    }
  }, [selectedCampaign, currentUser]);

  if (!isOpen) return null;

  const presetAmounts = [25, 50, 100, 250, 500];

  const fillTestCard = () => {
    setCardNumber('4532 8912 3456 7890');
    setCardExpiry('08/29');
    setCardCvv('421');
    setCardHolder(donorName ? donorName.toUpperCase() : 'CAPTAIN SAMANTHA REED');
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCampId = campaignId || (campaigns.length > 0 ? String(campaigns[0].id) : '');
    if (!finalCampId) {
      alert('Please select an active campaign drive.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    if (!donorEmail) {
      alert('Please provide your email address for the receipt.');
      return;
    }

    setGatewayState('processing');
    setProcessingStage(1);

    // Multi-stage realistic processing animation
    setTimeout(() => {
      setProcessingStage(2);
    }, 900);

    setTimeout(async () => {
      setProcessingStage(3);
      try {
        const methodLabel =
          paymentChannel === 'card' ? 'Credit Card (Visa)' : paymentChannel === 'upi' ? 'UPI / QR Instant' : selectedBank;

        const res = await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaign_id: Number(finalCampId),
            donor_name: isAnonymous ? 'Anonymous Supporter' : (donorName || 'Generous Supporter'),
            donor_email: donorEmail,
            amount: Number(amount),
            payment_method: methodLabel,
            message,
            is_anonymous: isAnonymous,
          }),
        });

        if (!res.ok) throw new Error('Transaction recording failed');
        const donationData = await res.json();
        setReceipt(donationData);
        setGatewayState('success');

        // Confetti celebration
        try {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ea580c', '#000000', '#f97316', '#ffffff'],
          });
        } catch {
          // ignore
        }

        onPaymentSuccess();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Payment simulation error');
        setGatewayState('form');
      }
    }, 1800);
  };

  const handleResetAndClose = () => {
    setGatewayState('form');
    setReceipt(null);
    onClose();
  };

  const copyTxn = () => {
    if (receipt?.transaction_id) {
      navigator.clipboard.writeText(receipt.transaction_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCamp = campaigns.find((c) => String(c.id) === campaignId) || selectedCampaign || campaigns[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 flex items-center justify-center text-white border border-white font-mono font-bold text-xs">
              RP
            </div>
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider block">
                ReliefPay Gateway // Sandbox Simulator
              </span>
            </div>
          </div>
          <button onClick={handleResetAndClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State 1: Processing Animation Screen */}
        {gatewayState === 'processing' && (
          <div className="p-12 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-20 h-20 bg-orange-50 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]">
              <RefreshCw className="w-10 h-10 text-orange-600 animate-spin" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-black text-black uppercase font-mono tracking-tight">
                {processingStage === 1 && 'Initiating Cryptographic Handshake...'}
                {processingStage === 2 && 'Authorizing $ ' + amount + ' with Banking Switch...'}
                {processingStage === 3 && 'Committing Ledger Entry to Supabase...'}
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                256-bit PCI-DSS Sandbox Protocol • Simulating live financial settlement
              </p>
            </div>

            <div className="w-64 h-3 bg-neutral-200 border-2 border-black overflow-hidden">
              <div
                className="bg-orange-600 h-full transition-all duration-700"
                style={{ width: `${processingStage * 33.3}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* State 2: Success & Official Printable Receipt */}
        {gatewayState === 'success' && receipt && (
          <div className="p-6 overflow-y-auto space-y-5">
            <div className="bg-emerald-50 border-2 border-emerald-600 p-4 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-1.5" />
              <h3 className="text-lg font-black text-black uppercase font-mono">
                Transaction Approved & Ledgered
              </h3>
              <p className="text-xs font-mono text-emerald-800">
                100% of your pledge is directly allocated to emergency relief operations.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-neutral-50 border-2 border-black p-5 space-y-3 font-mono text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div>
                  <span className="font-black text-black uppercase text-sm block">ReliefGrid Official Voucher</span>
                  <span className="text-[10px] text-neutral-500">Non-Profit Aid Delivery Receipt</span>
                </div>
                <span className="bg-black text-white font-bold px-2 py-0.5 text-[10px] uppercase">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">Transaction Reference:</span>
                  <div className="flex items-center gap-1 font-bold text-black">
                    <span>{receipt.transaction_id}</span>
                    <button onClick={copyTxn} className="hover:text-orange-600">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">Settled Amount:</span>
                  <span className="text-lg font-black text-orange-600">${Number(receipt.amount).toFixed(2)} USD</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">Donor of Record:</span>
                  <span className="font-bold text-black">{receipt.donor_name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">Payment Channel:</span>
                  <span className="font-bold text-black">{receipt.payment_method}</span>
                </div>
              </div>

              <div className="border-t border-neutral-300 pt-2">
                <span className="text-neutral-500 text-[10px] uppercase block">Benefiting Campaign:</span>
                <span className="font-bold text-black">{activeCamp?.title || 'Emergency General Fund'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-white hover:bg-neutral-100 text-black font-mono font-bold text-xs uppercase py-2.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Voucher
              </button>
              <button
                onClick={handleResetAndClose}
                className="flex-1 bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase py-2.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]"
              >
                Done & Return
              </button>
            </div>
          </div>
        )}

        {/* State 3: Payment Configuration & Interactive Portal */}
        {gatewayState === 'form' && (
          <form onSubmit={handleProcessPayment} className="p-6 overflow-y-auto space-y-5">
            {/* Drive Selector */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Select Benefiting Relief Drive
              </label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — Goal: ${Number(c.target_amount).toLocaleString()} ({c.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-bold uppercase text-black">
                  Donation Pledge Amount ($)
                </label>
                <span className="text-[10px] font-mono text-orange-600 font-bold">100% Tax Deductible</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-2">
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

            {/* Payment Channel Selector */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5">
                Choose Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentChannel('card')}
                  className={`py-2.5 px-3 border-2 border-black text-xs font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition-all ${
                    paymentChannel === 'card'
                      ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(234,88,12,1)]'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-orange-500" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChannel('upi')}
                  className={`py-2.5 px-3 border-2 border-black text-xs font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition-all ${
                    paymentChannel === 'upi'
                      ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(234,88,12,1)]'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-orange-500" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChannel('netbanking')}
                  className={`py-2.5 px-3 border-2 border-black text-xs font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition-all ${
                    paymentChannel === 'netbanking'
                      ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(234,88,12,1)]'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-orange-500" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* CHANNEL A: CREDIT / DEBIT CARD */}
            {paymentChannel === 'card' && (
              <div className="space-y-3 bg-neutral-50 p-4 border-2 border-black">
                {/* Visual Card Representation */}
                <div className="bg-linear-to-tr from-neutral-900 to-neutral-800 text-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-9 h-7 bg-amber-400 border border-black rounded-xs opacity-90"></div>
                    <span className="font-mono text-xs font-black tracking-widest text-orange-400">
                      RELIEF-PAY VISA
                    </span>
                  </div>
                  <div className="font-mono text-base tracking-widest mb-3">{cardNumber}</div>
                  <div className="flex justify-between items-end text-[10px] font-mono text-neutral-300">
                    <div>
                      <span className="block text-[8px] text-neutral-400 uppercase">Cardholder</span>
                      <span className="font-bold text-white uppercase">{cardHolder || 'GENEROUS DONOR'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-neutral-400 uppercase">Expires</span>
                      <span className="font-bold text-white">{cardExpiry}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={fillTestCard}
                    className="text-[10px] font-mono font-bold text-orange-600 hover:text-black flex items-center gap-1 underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-Fill Test Sandbox Card
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono font-bold uppercase text-black mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-black mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-black mb-1">
                      Security Code (CVV)
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="888"
                      className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CHANNEL B: UPI / QR CODE */}
            {paymentChannel === 'upi' && (
              <div className="bg-neutral-50 p-4 border-2 border-black space-y-4 text-center">
                <div className="inline-block p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {/* Simulated SVG QR Code */}
                  <svg viewBox="0 0 100 100" className="w-36 h-36 mx-auto fill-black">
                    <rect x="10" y="10" width="25" height="25" />
                    <rect x="15" y="15" width="15" height="15" fill="white" />
                    <rect x="18" y="18" width="9" height="9" />
                    <rect x="65" y="10" width="25" height="25" />
                    <rect x="70" y="15" width="15" height="15" fill="white" />
                    <rect x="73" y="18" width="9" height="9" />
                    <rect x="10" y="65" width="25" height="25" />
                    <rect x="15" y="70" width="15" height="15" fill="white" />
                    <rect x="18" y="73" width="9" height="9" />
                    <rect x="45" y="15" width="10" height="20" />
                    <rect x="45" y="45" width="10" height="10" fill="#ea580c" />
                    <rect x="65" y="45" width="25" height="10" />
                    <rect x="45" y="65" width="20" height="25" />
                    <rect x="75" y="75" width="15" height="15" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-black block">Scan with any UPI / Banking App</span>
                  <p className="text-[10px] font-mono text-neutral-500">
                    VPA: <code className="bg-neutral-200 px-1 py-0.5 text-black font-bold">reliefgrid@ybl</code> • Amount: ${amount}
                  </p>
                </div>
              </div>
            )}

            {/* CHANNEL C: NETBANKING */}
            {paymentChannel === 'netbanking' && (
              <div className="bg-neutral-50 p-4 border-2 border-black space-y-3">
                <label className="block text-xs font-mono font-bold uppercase text-black">
                  Select Institutional Clearing Bank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Chase Bank (USA)',
                    'Bank of America',
                    'Wells Fargo',
                    'Citibank NA',
                    'HDFC Bank (India)',
                    'State Bank of India',
                  ].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 text-left text-xs font-mono font-bold border-2 border-black transition-all ${
                        selectedBank === bank
                          ? 'bg-orange-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Donor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t-2 border-neutral-200">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-black mb-1">
                  Full Name {isAnonymous && '(Hidden on Ledger)'}
                </label>
                <input
                  type="text"
                  required={!isAnonymous}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-black mb-1">
                  Email Address (For Tax Receipt)
                </label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="donor@example.com"
                  className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black"
                />
              </div>
            </div>

            {/* Note & Anonymous Checkbox */}
            <div className="space-y-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dedication or public note (optional)"
                className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono text-black"
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 border-2 border-black accent-orange-600"
                />
                <span className="text-xs font-mono text-neutral-700">
                  Record as anonymous on public transparency ledger
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-sm uppercase py-3.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              AUTHORIZE ${amount} PLEDGE VIA {paymentChannel.toUpperCase()}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
