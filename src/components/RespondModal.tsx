import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, MapPin, Hospital, Phone, Clock, ShieldCheck, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RespondModal: React.FC = () => {
  const {
    activeRespondRequest,
    setActiveRespondRequest,
    currentDonor,
    respondToRequest,
  } = useApp();

  const [donorName, setDonorName] = useState(currentDonor?.name || '');
  const [donorPhone, setDonorPhone] = useState(currentDonor?.phone || '+91 98401 23456');
  const [eta, setEta] = useState('Within 30 minutes');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeRespondRequest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      respondToRequest(
        activeRespondRequest.id,
        donorName,
        donorPhone,
        `ETA: ${eta}${notes ? ` - ${notes}` : ''}`
      );
      setIsSubmitting(false);
      setActiveRespondRequest(null);

      // Trigger celebratory confetti for hero responder
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#dc2626', '#f87171', '#ffffff']
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-rose-100 my-8">
        {/* Header with emergency context */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white relative">
          <button
            onClick={() => setActiveRespondRequest(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <Heart className="w-6 h-6 text-rose-200 fill-rose-200" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-200 bg-red-800/60 px-2.5 py-0.5 rounded-full">
                Emergency Response (India)
              </span>
              <h3 className="text-xl font-bold mt-1 text-white">I Can Donate Blood</h3>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/10 rounded-xl text-xs space-y-1 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-rose-100">Patient: <strong className="text-white">{activeRespondRequest.patientName}</strong></span>
              <span className="px-2 py-0.5 rounded bg-white text-red-700 font-bold">
                {activeRespondRequest.requiredBloodGroup} Needed ({activeRespondRequest.unitsNeeded} Units)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-100">
              <Hospital className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{activeRespondRequest.hospitalName}, {activeRespondRequest.city} {activeRespondRequest.state ? `(${activeRespondRequest.state})` : ''}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Kannan / Priya Nair"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Contact Mobile (India +91) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimated Arrival Time (ETA)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-slate-50/50"
              >
                <option value="Immediately (Within 15 mins)">Immediately (Within 15 mins)</option>
                <option value="Within 30 minutes">Within 30 minutes</option>
                <option value="Within 1 hour">Within 1 hour</option>
                <option value="Within 2-3 hours">Within 2-3 hours</option>
                <option value="Scheduled for today evening">Scheduled for today evening</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Optional Message / Notes for Hospital Staff
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reaching hospital by two-wheeler, have original Aadhaar / blood donor card with me."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-slate-50/50"
            />
          </div>

          <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2.5 text-xs text-red-900">
            <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p>
              By clicking respond, your contact will be shared directly with the hospital trauma coordinator and patient requester ({activeRespondRequest.contactNumber}).
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveRespondRequest(null)}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              {isSubmitting ? 'Confirming...' : 'Confirm Response (+91)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
