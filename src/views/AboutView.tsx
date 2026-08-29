import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Droplet,
  Smartphone,
  Download,
  QrCode,
  ShieldCheck,
  Zap,
  Activity,
  Users,
  Building2,
  Award,
  PhoneCall,
  CheckCircle2,
  Info,
  Clock,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActiveTab, openAuthModal, openApkModal, downloadApkFile } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is LifeLink India and who operates it?',
      a: 'LifeLink is a non-profit voluntary blood donor coordination and emergency dispatch network designed to connect voluntary blood donors, patients, critical care ICU hospitals, and blood banks across 28 Indian States & 8 Union Territories with zero middlemen and zero commercialization.'
    },
    {
      q: 'How do I download and install the LifeLink Android App (APK)?',
      a: 'You can download the verified LifeLink Android APK (v2.4.0 • 14.8 MB) directly from this website using the "Download Android APK" button or scanning the QR code with your mobile camera. Tap "Download Anyway", open the APK, allow "Install from Unknown Sources", and complete sign-in with your mobile number.'
    },
    {
      q: 'Is blood donation on LifeLink completely free?',
      a: 'Yes. 100% free and strictly voluntary. LifeLink does not charge patients or donors. Selling or purchasing human blood is illegal under the Drugs and Cosmetics Act of India.'
    },
    {
      q: 'Who is eligible to donate blood in India?',
      a: 'Any healthy individual aged 18–65 years, weighing at least 45 kg, with hemoglobin level of 12.5 g/dL or above. Male donors can donate every 90 days (3 months), and female donors every 120 days (4 months).'
    },
    {
      q: 'What emergency helpline numbers are integrated into LifeLink?',
      a: 'LifeLink integrates directly with Indian National Helplines: 104 (National Health & Blood Availability Helpline), 108 (National Emergency Ambulance), 112 (All-in-One Emergency SOS), and 1910 (National Blood Transfusion Council Helpline).'
    }
  ];

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white p-8 md:p-12 border border-slate-800 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-rose-300 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>LifeLink India • Emergency Blood Mission</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit',sans-serif] tracking-tight leading-tight">
                Saving Lives Across India, <span className="text-red-500">One Drop at a Time</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Every two seconds, someone in India needs blood. LifeLink is a real-time, zero-brokerage emergency donor locator and hospital notification platform connecting voluntary lifesavers to patients in critical need.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={openApkModal}
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-500/30 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Android APK (v2.4)</span>
                </button>

                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-rose-400" />
                  <span>Sign In / Register (+91)</span>
                </button>

                <button
                  onClick={() => setActiveTab('find-donor')}
                  className="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  Search Donors
                </button>
              </div>
            </div>

            {/* APK Download Feature Box */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-md">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base">LifeLink Android App</h3>
                      <p className="text-xs text-rose-200">Official Release v2.4.0</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    APK Ready
                  </span>
                </div>

                <div className="bg-black/30 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Package File:</span>
                    <span className="font-mono text-white">LifeLink-v2.4.apk</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Size & Architecture:</span>
                    <span className="font-bold text-white">14.8 MB • Universal</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Target OS:</span>
                    <span className="font-bold text-emerald-400">Android 8.0 to Android 15+</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Security Check:</span>
                    <span className="font-bold text-emerald-400">✓ 100% Virus & Malware Free</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={downloadApkFile}
                    className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-red-500/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download APK</span>
                  </button>

                  <button
                    onClick={openApkModal}
                    className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/20"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan Phone QR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Real-Time SOS Dispatch</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When a Code Red blood emergency is declared, nearby matching voluntary donors receive audible notifications and direct hospital contact details within seconds.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Middlemen Policy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              LifeLink strictly enforces voluntary, non-remunerated blood donation standards in alignment with the National Blood Transfusion Council (NBTC) guidelines.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Smart Compatibility</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated antigen & Rh factor compatibility engine ensures donors are only alerted when their specific blood type can safely transfuse to the patient.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Donor Recognition & Certs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every voluntary donation generates an official digital LifeSaver Certificate with unique verification IDs for transparent tracking and lifetime recognition.
            </p>
          </div>
        </div>

        {/* National Helpline Integration Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <PhoneCall className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  24x7 India Emergency Helplines
                </span>
              </div>
              <h2 className="text-2xl font-black font-['Outfit',sans-serif]">
                In Immediate Medical Emergency? Dial Directly
              </h2>
              <p className="text-rose-100 text-xs max-w-xl">
                Toll-free government emergency services available 24/7 in all Indian languages across India.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:104"
                className="px-5 py-3 rounded-2xl bg-white text-red-700 font-extrabold text-xs shadow-md hover:bg-rose-50 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>104 (Blood Helpline)</span>
              </a>

              <a
                href="tel:108"
                className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>108 (Ambulance / ICU)</span>
              </a>

              <a
                href="tel:112"
                className="px-5 py-3 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs border border-white/30 transition-all"
              >
                112 (National SOS)
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Android APK Download section */}
        <div id="apk-download" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  LifeLink Android Mobile App (APK Download)
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Install the native Android application on any Android smartphone (Android 8.0 Oreo to Android 15+).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadApkFile}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-red-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download APK (14.8 MB)</span>
              </button>

              <button
                onClick={openApkModal}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Show QR</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-extrabold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="text-xs font-bold text-slate-900">Instant SOS Push Sirens</h4>
              <p className="text-xs text-slate-500">
                Never miss an emergency request. The native app alerts you even when your phone screen is off if a hospital within your radius needs your blood group.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="text-xs font-bold text-slate-900">1-Tap Direct Hospital Calling</h4>
              <p className="text-xs text-slate-500">
                Direct phone integration lets you connect with the patient's relative or hospital blood bank desk in one tap without searching phonebooks.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="text-xs font-bold text-slate-900">Offline Eligibility Matrix</h4>
              <p className="text-xs text-slate-500">
                Access full blood compatibility charts, health quiz, and safety protocols without requiring active cellular mobile data.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1 text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">
              Clear answers regarding voluntary blood donation guidelines and using LifeLink in India.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4.5 text-left bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4 font-bold text-xs text-slate-900 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4.5 pt-2 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
