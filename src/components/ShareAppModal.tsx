import React, { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, Globe, QrCode, ShieldCheck, Heart } from 'lucide-react';
import { soundManager } from '../utils/audioAlert';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Close modal when pressing Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Custom domain URL specified by the user
  const customUrl = 'https://lifelinkblood.in';

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

  const handleClose = () => {
    soundManager.playClickSound();
    onClose();
  };

  // QR Code generator encoding the custom URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(customUrl)}`;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-scale cursor-pointer overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 cursor-default my-auto"
      >
        {/* Header - Fixed at top of modal */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 id="share-modal-title" className="font-bold text-base leading-tight font-['Outfit',sans-serif]">
                LifeLink
              </h3>
              <p className="text-xs text-red-100">Official Mobile & Web Access</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors text-white cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto overscroll-contain">
          {/* Quick instructions banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              Direct Custom Portal Access
            </p>
            <p className="leading-relaxed text-[11px] sm:text-xs">
              Open <strong className="text-slate-900">LifeLink</strong> directly at <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-red-600 font-bold font-mono text-[11px]">{customUrl}</code> on any mobile device to search donors, track blood reserves, and broadcast priority emergency SOS alerts.
            </p>
          </div>

          {/* QR Code section */}
          <div className="flex flex-col items-center justify-center bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 text-center">
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xs border border-slate-200 mb-2">
              <img
                src={qrCodeUrl}
                alt={`Scan to open ${customUrl}`}
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                loading="eager"
              />
            </div>
            <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-red-600 shrink-0" />
              Scan with phone camera to open {customUrl}
            </p>
          </div>

          {/* Custom App Link Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
                className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
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
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Open LifeLink Blood Donation App: ${customUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>Share via WhatsApp</span>
            </a>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-98 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share</span>
              </button>
            )}
            <button
              onClick={handleClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 text-xs font-semibold text-center transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
