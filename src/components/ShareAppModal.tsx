import React, { useState } from 'react';
import { X, Share2, Copy, Check, Smartphone, Globe, QrCode, ShieldCheck, Heart } from 'lucide-react';
import { soundManager } from '../utils/audioAlert';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  // Custom domain URL specified by the user
  const customUrl = 'https://Lifelink.in';

  const handleCopy = (text: string, key: string) => {
    soundManager.playSuccessSound();
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleNativeShare = () => {
    soundManager.playClickSound();
    if (navigator.share) {
      navigator.share({
        title: 'LifeLink – Blood Donation Platform',
        text: 'Access LifeLink Emergency Blood Donation & Donor Finder on your phone:',
        url: customUrl,
      }).catch(() => {});
    }
  };

  // QR Code generator encoding the custom URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(customUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-scale">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight font-['Outfit',sans-serif]">LifeLink</h3>
              <p className="text-xs text-red-100">Official Mobile & Web Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick instructions banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Direct Custom Portal Access
            </p>
            <p className="leading-relaxed">
              Open <strong className="text-slate-900">LifeLink</strong> directly at <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-red-600 font-bold font-mono text-[11px]">{customUrl}</code> on any mobile device or browser to search donors, track blood reserves, and broadcast priority emergency SOS alerts.
            </p>
          </div>

          {/* QR Code section */}
          <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-200 mb-2.5">
              <img
                src={qrCodeUrl}
                alt={`Scan to open ${customUrl}`}
                className="w-40 h-40 object-contain"
              />
            </div>
            <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-red-600" />
              Scan with your phone camera to open {customUrl}
            </p>
          </div>

          {/* Custom App Link */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                Custom Portal URL
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Link
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 pl-3">
              <input
                type="text"
                readOnly
                value={customUrl}
                className="w-full text-xs font-mono font-bold bg-transparent text-slate-900 focus:outline-hidden truncate select-all"
              />
              <button
                onClick={() => handleCopy(customUrl, 'custom')}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink === 'custom' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Open LifeLink Blood Donation App: ${customUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Share via WhatsApp</span>
            </a>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
