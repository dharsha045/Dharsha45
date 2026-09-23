import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import {
  Search,
  UserPlus,
  ArrowRight,
  MapPin,
  Building2,
  ChevronDown,
  Sparkles,
  Users
} from 'lucide-react';
import { INDIAN_STATES_AND_UTS, getDistrictsForState } from '../data/indiaLocations';

export const HomeHero: React.FC = () => {
  const {
    setActiveTab,
    bloodRequests,
    donors,
    setSearchBloodGroupFilter,
    setSearchStateFilter,
    setSearchDistrictFilter,
    searchStateFilter,
    searchDistrictFilter,
    searchBloodGroupFilter
  } = useApp();

  const [selectedBlood, setSelectedBlood] = useState<BloodGroup | 'All'>(searchBloodGroupFilter || 'All');
  const [selectedState, setSelectedState] = useState<string>(searchStateFilter || '');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(searchDistrictFilter || '');

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // Dynamically get districts belonging ONLY to the selected State/UT
  const availableDistricts = selectedState ? getDistrictsForState(selectedState) : [];
  const isDistrictDisabled = !selectedState;

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    // Reset district selection whenever the state changes
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
  };

  const openUrgentCount = bloodRequests.filter(
    (r) => (r.emergencyLevel === 'Critical' || r.emergencyLevel === 'Urgent') && r.status === 'Open'
  ).length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchBloodGroupFilter(selectedBlood);
    setSearchStateFilter(selectedState);
    setSearchDistrictFilter(selectedDistrict);
    setActiveTab('find-donor');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/50 via-white to-slate-50 pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-slate-200/80">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Compact Emergency Blood Network Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-xs font-semibold text-slate-700">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="font-bold text-slate-900">Emergency Blood Network Active</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-600 truncate">
              {openUrgentCount === 0
                ? 'Zero unfulfilled shortages'
                : `${openUrgentCount} urgent ${openUrgentCount === 1 ? 'need' : 'needs'} today`}
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] font-['Outfit',sans-serif] text-balance">
            Donate Blood, <span className="text-red-600">Save Lives.</span>
          </h1>

          {/* Shorter, Professional Supporting Description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            A verified emergency network connecting voluntary donors with patients and trauma centers in real time across India.
          </p>

          {/* Only Two Primary Hero Actions: Become a Donor & Find a Donor */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab('register-donor')}
              className="w-full sm:w-auto min-w-[180px] px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Become a Donor</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('find-donor')}
              className="w-full sm:w-auto min-w-[180px] px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition-all hover:border-slate-400 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-red-600 shrink-0" />
              <span>Find a Donor</span>
            </button>
          </div>
        </div>

        {/* Redesigned Quick Emergency Donor Search Section */}
        <div className="mt-12 sm:mt-14 max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg shadow-slate-200/50 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                Quick Emergency Donor Search
              </h2>
            </div>
            {/* Dynamic Donor Count */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium self-start sm:self-auto">
              <Users className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>
                <strong className="text-slate-900 font-bold tabular-nums">
                  {donors.length.toLocaleString()}
                </strong>{' '}
                verified {donors.length === 1 ? 'donor' : 'donors'} registered
              </span>
            </div>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Blood Group Dropdown */}
            <div className="lg:col-span-3">
              <label htmlFor="quick-blood-group" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required Blood Group
              </label>
              <div className="relative">
                <select
                  id="quick-blood-group"
                  value={selectedBlood}
                  onChange={(e) => setSelectedBlood(e.target.value as any)}
                  className="w-full h-11 px-3.5 pr-8 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all cursor-pointer appearance-none"
                >
                  <option value="All">All Blood Groups</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 1. State / Union Territory Dropdown */}
            <div className="lg:col-span-3">
              <label htmlFor="quick-state" className="block text-xs font-semibold text-slate-700 mb-1.5">
                State / Union Territory
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  id="quick-state"
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full h-11 pl-10 pr-8 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all cursor-pointer appearance-none truncate"
                >
                  <option value="">Select State / UT</option>
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 2. District Dropdown (Dependent) */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="quick-district" className="block text-xs font-semibold text-slate-700">
                  District
                </label>
                {isDistrictDisabled && (
                  <span className="text-[10px] text-slate-400 font-normal">
                    Select State first
                  </span>
                )}
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  id="quick-district"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  disabled={isDistrictDisabled}
                  className={`w-full h-11 pl-10 pr-8 rounded-xl border text-sm font-semibold transition-all appearance-none truncate ${
                    isDistrictDisabled
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-800 border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer'
                  }`}
                >
                  <option value="">
                    {isDistrictDisabled ? 'Select State / UT first' : 'Select District'}
                  </option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                <span>Search Donors</span>
              </button>
            </div>
          </form>

          {/* Quick Access Blood Groups & Clinical Guides */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-medium">Quick search:</span>
              {(['O-', 'O+', 'A+', 'B+'] as BloodGroup[]).map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => {
                    setSelectedBlood(bg);
                    setSearchBloodGroupFilter(bg);
                    setActiveTab('find-donor');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {bg}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('compatibility-guide')}
              className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transfusion Compatibility Matrix</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


