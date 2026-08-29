import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  MapPin,
  Mail,
  RefreshCw,
  ExternalLink,
  Activity,
  Info,
  Smartphone,
  Download,
  LogIn,
  UserPlus
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setActiveTab,
    resetToEmpty,
    loadSampleData,
    donors,
    openAuthModal,
    openApkModal,
    downloadApkFile,
  } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Emergency Action Band */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 mb-14 text-white shadow-xl shadow-red-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-rose-100">
              <PhoneCall className="w-3.5 h-3.5" />
              24/7 All-India Emergency Blood Helpline (108 / 104)
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
              Facing a Critical Blood Emergency in India?
            </h3>
            <p className="text-sm text-rose-100 max-w-xl">
              Broadcast an instant priority alert to nearby verified volunteer donors across all Indian states and affiliated trauma hospitals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('request-blood')}
              className="px-6 py-3 rounded-xl bg-white text-red-700 font-extrabold text-sm hover:bg-rose-50 shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              Post Emergency Request (+91)
            </button>
            <button
              onClick={openApkModal}
              className="px-5 py-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Download APK (v2.4)</span>
            </button>
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
                Life<span className="text-red-500">Link</span> <span className="text-xs uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-normal">India</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Smart blood donation and emergency donor network across India connecting patients, verified voluntary donors, Indian trauma centers, and blood banks to eliminate preventable delays in critical care.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>99.9% Pan-India Uptime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>NBTC & CDSCO Aligned</span>
              </div>
            </div>

            {/* Quick APK button in footer */}
            <div className="pt-2">
              <button
                onClick={openApkModal}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android App APK (14.8 MB)</span>
                <Download className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors text-rose-300 font-bold cursor-pointer">
                  About LifeLink & App
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('find-donor')} className="hover:text-white transition-colors cursor-pointer">
                  Find Indian Donors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('register-donor')} className="hover:text-white transition-colors cursor-pointer">
                  Volunteer Donor Registration (+91)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('emergency-alerts')} className="hover:text-white transition-colors text-red-400 font-semibold cursor-pointer">
                  Live Emergency SOS Feed
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('compatibility-guide')} className="hover:text-white transition-colors cursor-pointer">
                  Blood Compatibility Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Donor Tools & Clinical */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">User Account & Tools</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => openAuthModal('login')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-emerald-400 font-semibold">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login (Email / Mobile)</span>
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('signup')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up / New Account</span>
                </button>
              </li>
              <li>
                <button onClick={openApkModal} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-rose-300">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Android APK</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('eligibility-checker')} className="hover:text-white transition-colors cursor-pointer">
                  Eligibility Checker (India)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('donor-dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Donor Impact Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin-dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Hospital Admin Command
                </button>
              </li>
              {donors.length === 0 ? (
                <li>
                  <button onClick={loadSampleData} className="hover:text-emerald-400 transition-colors text-emerald-400 font-semibold flex items-center gap-1 cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5" />
                    Load Sample Data
                  </button>
                </li>
              ) : (
                <li>
                  <button onClick={resetToEmpty} className="hover:text-rose-400 transition-colors text-slate-400 flex items-center gap-1 cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear / Empty Database (0)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Emergency Helplines</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Emergency Ambulance: <strong>108 / 102</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>National Blood Helpline: <strong>+91 1800 11 9999</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>support@lifelink.org.in</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>National Blood Grid & Trauma Centre Network, India</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LifeLink India. All rights reserved. Dedicated to zero preventable blood shortage deaths.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-400 cursor-pointer">
              About Mission
            </button>
            <button onClick={openApkModal} className="hover:text-slate-400 cursor-pointer">
              Android APK
            </button>
            <span className="hover:text-slate-400 cursor-pointer">NBTC Guidelines</span>
            <span className="hover:text-slate-400 cursor-pointer">Medical Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

