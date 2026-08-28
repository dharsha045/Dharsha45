import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { Heart, Search, UserPlus, Droplet, Siren, ShieldCheck, ArrowRight, MapPin, Sparkles, Activity } from 'lucide-react';
import { MAJOR_CITIES } from '../data/mockData';

export const HomeHero: React.FC = () => {
  const { setActiveTab, bloodRequests, donors } = useApp();

  const [selectedBlood, setSelectedBlood] = useState<BloodGroup | 'All'>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const openUrgentCount = bloodRequests.filter(
    (r) => (r.emergencyLevel === 'Critical' || r.emergencyLevel === 'Urgent') && r.status === 'Open'
  ).length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('find-donor');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200/60">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-200 shadow-sm text-xs font-semibold text-red-700 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="font-bold">LifeLink Emergency Network Active</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">{openUrgentCount} Urgent Needs Today</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-['Outfit',sans-serif]">
            Donate Blood, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">Save Lives.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A fast, secure, and intelligent platform connecting volunteer blood donors, emergency patients, trauma hospitals, and blood banks in real time.
          </p>

          {/* Core Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('register-donor')}
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-500/25 transition-all hover:scale-105 flex items-center gap-2 group"
            >
              <UserPlus className="w-5 h-5" />
              <span>Become a Donor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('find-donor')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-sm transition-all hover:border-slate-400 flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-red-600" />
              <span>Find a Donor</span>
            </button>

            <button
              onClick={() => setActiveTab('request-blood')}
              className="px-6 py-3.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-red-800 font-bold text-sm sm:text-base transition-all flex items-center gap-2"
            >
              <Droplet className="w-5 h-5 fill-red-600 text-red-600" />
              <span>Request Blood</span>
            </button>
          </div>
        </div>

        {/* Quick Search Card Bar */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Quick Emergency Donor Search
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Over {donors.length * 120}+ verified registered donors
            </span>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Blood Type Selector */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Required Blood Group
              </label>
              <select
                value={selectedBlood}
                onChange={(e) => setSelectedBlood(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              >
                <option value="All">All Blood Groups</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} (Blood Group)
                  </option>
                ))}
              </select>
            </div>

            {/* City / Location */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                City / Trauma Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                >
                  {MAJOR_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Donors</span>
              </button>
            </div>
          </form>

          {/* Quick Blood Group Chips */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium mr-1">Popular:</span>
            {['O-', 'O+', 'A+', 'B+'].map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => {
                  setSelectedBlood(bg as BloodGroup);
                  setActiveTab('find-donor');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold transition-colors"
              >
                {bg}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveTab('compatibility-guide')}
              className="ml-auto text-red-600 hover:underline font-semibold flex items-center gap-1 text-[11px]"
            >
              <Sparkles className="w-3 h-3" />
              View Compatibility Matrix
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
