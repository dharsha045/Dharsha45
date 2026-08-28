import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, PhoneCall, ShieldAlert, Sparkles, MapPin, Mail, RefreshCw, ExternalLink, Activity, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, resetToDemoData, simulateIncomingEmergency } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Emergency Action Band */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 mb-14 text-white shadow-xl shadow-red-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-rose-100">
              <PhoneCall className="w-3.5 h-3.5" />
              24/7 National Emergency Blood Dispatch
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
              Facing a Critical Blood Emergency?
            </h3>
            <p className="text-sm text-rose-100 max-w-xl">
              Broadcast an instant priority SOS alert to nearby verified donors and affiliated trauma centers within seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('request-blood')}
              className="px-6 py-3 rounded-xl bg-white text-red-700 font-extrabold text-sm hover:bg-rose-50 shadow-md transition-all hover:scale-105"
            >
              Post Emergency Request
            </button>
            <a
              href="tel:18005552566"
              className="px-5 py-3 rounded-xl bg-red-800/80 hover:bg-red-800 text-white font-bold text-sm border border-red-400/30 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              1-800-BLOOD-SOS
            </a>
          </div>
        </div>

        {/* 4-Column Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 text-sm">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white shadow-md">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
                Life<span className="text-red-500">Link</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Smart blood donation and emergency donor network connecting patients, verified volunteer donors, hospitals, and national blood banks to eliminate preventable delays in critical care.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>99.9% Network Uptime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>HIPAA & Blood Safe Standards</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('find-donor')} className="hover:text-white transition-colors">
                  Find Nearby Donors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('register-donor')} className="hover:text-white transition-colors">
                  Donor Registration
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('emergency-alerts')} className="hover:text-white transition-colors text-red-400 font-semibold">
                  Live Emergency Feed
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('compatibility-guide')} className="hover:text-white transition-colors">
                  Blood Compatibility Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Donor Tools & Clinical */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clinical & Tools</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('eligibility-checker')} className="hover:text-white transition-colors">
                  Eligibility Checker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('donor-dashboard')} className="hover:text-white transition-colors">
                  Donor Impact Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin-dashboard')} className="hover:text-white transition-colors">
                  Hospital Admin Command
                </button>
              </li>
              <li>
                <button onClick={simulateIncomingEmergency} className="hover:text-amber-400 transition-colors text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Simulate Emergency SOS
                </button>
              </li>
              <li>
                <button onClick={resetToDemoData} className="hover:text-rose-400 transition-colors text-slate-400 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Simulation Data
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Emergency Help</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Trauma Dispatch: <strong>+1 (800) 555-BLOOD</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>support@lifelink-health.org</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>National Blood Reserve Coordinating Office</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LifeLink Network. All rights reserved. Built for emergency healthcare response.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-slate-400 cursor-pointer">HIPAA Compliance</span>
            <span className="hover:text-slate-400 cursor-pointer">Medical Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
