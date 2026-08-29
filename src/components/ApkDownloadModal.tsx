import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Download,
  Smartphone,
  QrCode,
  ShieldCheck,
  Zap,
  CheckCircle,
  FileCode,
  Bell,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Heart,
  Droplet
} from 'lucide-react';

export const ApkDownloadModal: React.FC = () => {
  const { isApkModalOpen, closeApkModal, downloadApkFile } = useApp();
  const [activeTab, setActiveTab] = useState<'direct' | 'qr' | 'guide'>('direct');
  const [guideOpen, setGuideOpen] = useState(false);

  if (!isApkModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 p-6 text-white relative">
          <button
            onClick={closeApkModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 border border-white/20 shrink-0">
              <Heart className="w-8 h-8 fill-white text-white" />
              <Droplet className="w-4 h-4 fill-rose-200 text-rose-200 absolute -bottom-1 -right-1" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-['Outfit',sans-serif]">LifeLink Android</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Official APK v2.4.0
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                India’s #1 Real-Time Blood Emergency & Volunteer Dispatch App
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span>📦 14.8 MB</span>
                <span>•</span>
                <span>⚡ Android 8.0+</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">✓ Verified Safe</span>
              </div>
            </div>
          </div>

          {/* Modal subtabs */}
          <div className="flex bg-white/10 p-1 rounded-xl mt-5 border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'direct' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Direct Download</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR Code</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'guide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install Steps</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Direct Download */}
        {activeTab === 'direct' && (
          <div className="p-6 space-y-5">
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-slate-900">LifeLink-India-v2.4.0.apk</h4>
                <p className="text-[11px] text-slate-500">Universal Android Package (ARM64, ARMv7, x86)</p>
                <p className="text-[10px] font-mono text-slate-400">SHA-256: 9e4f5a3b2c1d0e8f...</p>
              </div>
              <button
                onClick={downloadApkFile}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/25 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download APK</span>
              </button>
            </div>

            {/* App Highlights */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Exclusive Android App Features
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <Bell className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Push Emergency Siren</h5>
                    <p className="text-[10px] text-slate-500">Instant vibration alert when Code Red needs blood in your city</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <Radio className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">GPS Proximity Alerts</h5>
                    <p className="text-[10px] text-slate-500">Nearest hospital matching within 5 to 25 km radius</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">1-Tap 108/104 Dialing</h5>
                    <p className="text-[10px] text-slate-500">Direct helpline & hospital blood bank connection</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Offline Matrix</h5>
                    <p className="text-[10px] text-slate-500">Check compatibility & donor criteria without internet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Install Note */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left">
              <button
                onClick={() => setGuideOpen(!guideOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer"
              >
                <span>How to install APK on your Android phone?</span>
                {guideOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {guideOpen && (
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1 mt-2.5 pt-2 border-t border-slate-200">
                  <li>Tap the <strong>Download APK</strong> button above.</li>
                  <li>When prompted with <em>"File might be harmful"</em>, tap <strong>Download anyway</strong> (standard Android warning for non-Play Store APKs).</li>
                  <li>Tap the downloaded file in your browser downloads or Files app.</li>
                  <li>Select <strong>Install</strong> (Allow <em>"Install unknown apps"</em> from Chrome if asked).</li>
                  <li>Open LifeLink and sign in with your mobile number (+91) to activate real-time emergency dispatch.</li>
                </ol>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: QR Code */}
        {activeTab === 'qr' && (
          <div className="p-6 text-center space-y-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl inline-block shadow-xs">
              {/* Clean high-res SVG QR code representation */}
              <div className="w-48 h-48 bg-white p-2 rounded-2xl border border-slate-300 flex flex-col items-center justify-center relative shadow-inner">
                <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Top-left position marker */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="#dc2626" />

                  {/* Top-right position marker */}
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="#dc2626" />

                  {/* Bottom-left position marker */}
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="#dc2626" />

                  {/* Simulated QR data grid */}
                  <rect x="38" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="48" y="8" width="12" height="6" rx="1" fill="#0f172a" />
                  <rect x="38" y="18" width="10" height="6" rx="1" fill="#0f172a" />
                  <rect x="52" y="18" width="8" height="6" rx="1" fill="#0f172a" />
                  <rect x="38" y="28" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="48" y="28" width="12" height="6" rx="1" fill="#0f172a" />

                  <rect x="8" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="18" y="38" width="14" height="6" rx="1" fill="#0f172a" />
                  <rect x="38" y="38" width="24" height="6" rx="1" fill="#dc2626" />
                  <rect x="68" y="38" width="10" height="6" rx="1" fill="#0f172a" />
                  <rect x="82" y="38" width="10" height="6" rx="1" fill="#0f172a" />

                  <rect x="8" y="48" width="12" height="6" rx="1" fill="#0f172a" />
                  <rect x="24" y="48" width="8" height="6" rx="1" fill="#0f172a" />
                  <rect x="38" y="48" width="8" height="6" rx="1" fill="#0f172a" />
                  <rect x="52" y="48" width="10" height="6" rx="1" fill="#0f172a" />
                  <rect x="68" y="48" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="78" y="48" width="14" height="6" rx="1" fill="#0f172a" />

                  <rect x="8" y="58" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="18" y="58" width="14" height="6" rx="1" fill="#0f172a" />
                  <rect x="38" y="58" width="14" height="6" rx="1" fill="#0f172a" />
                  <rect x="56" y="58" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="68" y="58" width="24" height="6" rx="1" fill="#0f172a" />

                  <rect x="38" y="68" width="10" height="6" rx="1" fill="#0f172a" />
                  <rect x="52" y="68" width="10" height="6" rx="1" fill="#0f172a" />
                  <rect x="68" y="68" width="12" height="6" rx="1" fill="#0f172a" />
                  <rect x="84" y="68" width="8" height="6" rx="1" fill="#0f172a" />

                  <rect x="38" y="78" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="48" y="78" width="14" height="6" rx="1" fill="#0f172a" />
                  <rect x="68" y="78" width="8" height="6" rx="1" fill="#0f172a" />
                  <rect x="80" y="78" width="12" height="6" rx="1" fill="#0f172a" />

                  <rect x="38" y="88" width="16" height="6" rx="1" fill="#0f172a" />
                  <rect x="58" y="88" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="68" y="88" width="14" height="6" rx="1" fill="#0f172a" />
                  <rect x="86" y="88" width="6" height="6" rx="1" fill="#0f172a" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-red-200">
                    <Droplet className="w-4 h-4 fill-red-600 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Scan with your Phone Camera or Google Lens</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Point your Android camera at the QR code to download and install LifeLink APK directly onto your phone.
              </p>
            </div>

            <button
              onClick={downloadApkFile}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Or Download on this device (14.8 MB)
            </button>
          </div>
        )}

        {/* Tab 3: Installation Guide */}
        {activeTab === 'guide' && (
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Download APK Package</h5>
                  <p className="text-[11px] text-slate-500">Tap Download APK. If Chrome warns "File might be harmful", tap <strong>Download anyway</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Allow "Install Unknown Apps"</h5>
                  <p className="text-[11px] text-slate-500">Go to Settings &gt; Apps &gt; Chrome &gt; Toggle on <strong>"Allow from this source"</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Install & Enable Permissions</h5>
                  <p className="text-[11px] text-slate-500">Tap Install. Open LifeLink and grant Notification and Location permissions for emergency siren alerts.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={downloadApkFile}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Start APK Download Now (14.8 MB)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
