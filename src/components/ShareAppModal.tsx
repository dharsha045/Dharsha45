import React, { useState } from 'react';
import { X, Share2, Copy, Check, Smartphone, Globe, ExternalLink, QrCode } from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  // The current active domain URL or live preview URL
  const currentLiveUrl = window.location.origin;
  const cloudAppUrl = 'https://ais-pre-jvjujadx5wkfmd3xdujcsp-172412249995.asia-southeast1.run.app';
  const githubPagesUserUrl = 'https://dharsha06.github.io/';
  const preferredUrl = currentLiveUrl && !currentLiveUrl.includes('localhost') ? currentLiveUrl : cloudAppUrl;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'LifeLink – Blood Donation Platform',
        text: 'Access LifeLink Emergency Blood Donation & Donor Finder on your phone:',
        url: preferredUrl,
      }).catch(() => {});
    }
  };

  // QR Code generator using free fast standard QR chart endpoint
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(preferredUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-scale">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Open LifeLink on Mobile</h3>
              <p className="text-xs text-red-100">Working direct links & phone access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Notice box on error: why dharsha06.github failed */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900">
            <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
              <span>⚠️</span> Note on "dharsha06.github"
            </p>
            <p className="text-slate-700 leading-relaxed">
              Browsers cannot resolve <code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-mono text-[11px]">dharsha06.github</code> because GitHub Pages requires <strong className="text-slate-900">.github.io</strong>. Use the verified links below to open directly:
            </p>
          </div>

          {/* QR Code section */}
          <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="bg-white p-2.5 rounded-xl shadow-xs border border-slate-200 mb-2.5">
              <img
                src={qrCodeUrl}
                alt="Scan to open LifeLink on Phone"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-red-600" />
              Scan with your phone camera to open instantly
            </p>
          </div>

          {/* Link 1: Direct Live Cloud App */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                Direct Live Web App (Instant Access)
              </span>
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Recommended
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 pl-3">
              <input
                type="text"
                readOnly
                value={preferredUrl}
                className="w-full text-xs font-mono bg-transparent text-slate-700 focus:outline-hidden truncate"
              />
              <button
                onClick={() => handleCopy(preferredUrl, 'live')}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 flex items-center gap-1 transition-colors"
              >
                {copiedLink === 'live' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Link 2: GitHub Pages correct URL format */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              Correct GitHub Pages Link Format
            </span>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 pl-3">
              <input
                type="text"
                readOnly
                value={githubPagesUserUrl}
                className="w-full text-xs font-mono bg-transparent text-slate-700 focus:outline-hidden truncate"
              />
              <button
                onClick={() => handleCopy(githubPagesUserUrl, 'gh')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shrink-0 flex items-center gap-1 transition-colors"
              >
                {copiedLink === 'gh' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Note the <strong className="text-slate-700">.github.io</strong> ending instead of <em className="text-red-600 not-italic">.github</em>. If published under a repository name, the URL is <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono text-[10px]">https://dharsha06.github.io/repo-name/</code>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Open LifeLink Blood Donation App on mobile: ${preferredUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Share via WhatsApp</span>
            </a>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
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
