import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, MessageSquare, Mail, MapPin, ShieldCheck, Copy, Check, Heart, ExternalLink } from 'lucide-react';

export const DonorContactModal: React.FC = () => {
  const { selectedDonorContact, setSelectedDonorContact, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!selectedDonorContact) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(selectedDonorContact.phone);
    setCopied(true);
    showToast('info', 'Phone Copied', `${selectedDonorContact.phone} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white relative">
          <button
            onClick={() => setSelectedDonorContact(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={selectedDonorContact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
              alt={selectedDonorContact.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedDonorContact.name}</h3>
                {selectedDonorContact.verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                )}
              </div>
              <p className="text-xs text-rose-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {selectedDonorContact.location}, {selectedDonorContact.city}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-white text-red-700 font-extrabold text-xs shadow-xs">
                  {selectedDonorContact.bloodGroup} Blood Group
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                  selectedDonorContact.isAvailable
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/40'
                    : 'bg-slate-700/50 text-slate-300'
                }`}>
                  {selectedDonorContact.isAvailable ? '● Available' : '○ Busy'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Action Buttons */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Direct Phone Line</span>
              <button
                onClick={handleCopyPhone}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-lg font-mono font-bold text-slate-800 tracking-wide">
              {selectedDonorContact.phone}
            </p>
          </div>

          {selectedDonorContact.bio && (
            <p className="text-xs text-slate-600 italic bg-rose-50/60 p-3 rounded-xl border border-rose-100/80">
              "{selectedDonorContact.bio}"
            </p>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={`tel:${selectedDonorContact.phone}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-500/20 transition-all text-center"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>

            <a
              href={`sms:${selectedDonorContact.phone}?body=Hello%20${encodeURIComponent(selectedDonorContact.name)},%20I%20found%20your%20profile%20on%20LifeLink%20for%20urgent%20${encodeURIComponent(selectedDonorContact.bloodGroup)}%20blood%20donation.`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm transition-all text-center"
            >
              <MessageSquare className="w-4 h-4" />
              Send SMS
            </a>
          </div>

          <a
            href={`mailto:${selectedDonorContact.email}?subject=LifeLink%20Blood%20Donation%20Request%20(${selectedDonorContact.bloodGroup})&body=Dear%20${encodeURIComponent(selectedDonorContact.name)},%0A%0AWe%20are%20reaching%20out%20via%20LifeLink%20regarding%20an%20urgent%20blood%20need%20for%20a%20patient.`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-medium text-xs transition-colors text-center"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            Send Email ({selectedDonorContact.email})
          </a>

          <div className="text-[11px] text-slate-400 text-center pt-2">
            Average response time: <strong>~{selectedDonorContact.responseTimeMinutes} minutes</strong> • Total lives saved: <strong>{selectedDonorContact.livesSaved}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
