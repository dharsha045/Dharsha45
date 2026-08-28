import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, Donor } from '../types';
import {
  Search,
  MapPin,
  Filter,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  Heart,
  Droplet,
  UserPlus,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Navigation
} from 'lucide-react';
import { MAJOR_CITIES } from '../data/mockData';
import { COMPATIBLE_DONORS_MAP } from '../utils/compatibility';

export const FindDonorView: React.FC = () => {
  const { donors, setSelectedDonorContact, setActiveTab } = useApp();

  const [selectedBlood, setSelectedBlood] = useState<BloodGroup | 'All'>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available_only'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [includeCompatible, setIncludeCompatible] = useState<boolean>(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'grid' | 'radar'>('grid');

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // Filter logic
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      // Blood Group matching
      if (selectedBlood !== 'All') {
        if (includeCompatible) {
          const compatibleTypes = COMPATIBLE_DONORS_MAP[selectedBlood] || [selectedBlood];
          if (!compatibleTypes.includes(donor.bloodGroup)) return false;
        } else {
          if (donor.bloodGroup !== selectedBlood) return false;
        }
      }

      // City matching
      if (selectedCity !== 'All Cities' && donor.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Availability matching
      if (availabilityFilter === 'available_only' && !donor.isAvailable) {
        return false;
      }

      // Text search matching (name, location, bio)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = donor.name.toLowerCase().includes(query);
        const matchesLocation = donor.location.toLowerCase().includes(query);
        const matchesCity = donor.city.toLowerCase().includes(query);
        const matchesBlood = donor.bloodGroup.toLowerCase().includes(query);
        if (!matchesName && !matchesLocation && !matchesCity && !matchesBlood) return false;
      }

      return true;
    });
  }, [donors, selectedBlood, selectedCity, availabilityFilter, searchQuery, includeCompatible]);

  const availableCount = filteredDonors.filter((d) => d.isAvailable).length;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
              <Search className="w-3.5 h-3.5" />
              Verified Donor Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
              Find a Blood Donor
            </h1>
            <p className="text-slate-600 text-sm">
              Search by blood group, city, and real-time availability. Connect directly for emergency transfusions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('register-donor')}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Register as Donor
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Row 1: Blood Group Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-red-600" />
                Select Blood Group
              </label>

              {selectedBlood !== 'All' && (
                <label className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCompatible}
                    onChange={(e) => setIncludeCompatible(e.target.checked)}
                    className="rounded text-red-600 accent-red-600 w-3.5 h-3.5"
                  />
                  <span>Show Compatible Donors (for {selectedBlood})</span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              <button
                type="button"
                onClick={() => setSelectedBlood('All')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
                  selectedBlood === 'All'
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20 ring-2 ring-red-300'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All ({donors.length})
              </button>

              {bloodGroups.map((bg) => {
                const count = donors.filter((d) => d.bloodGroup === bg).length;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedBlood(bg)}
                    className={`py-2.5 px-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-1.5 ${
                      selectedBlood === bg
                        ? 'bg-red-600 text-white shadow-md shadow-red-500/20 ring-2 ring-red-300 scale-105'
                        : 'bg-slate-50 text-slate-800 hover:bg-rose-50 hover:text-red-700 border border-slate-200'
                    }`}
                  >
                    <span>{bg}</span>
                    <span className={`text-[10px] font-normal ${selectedBlood === bg ? 'text-rose-200' : 'text-slate-400'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: City, Search Text, Availability Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-slate-100">
            {/* Search Input */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Search Name / Hospital / Area
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Sarah, Manhattan, Trauma..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>
            </div>

            {/* City Dropdown */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                >
                  {MAJOR_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="sm:col-span-4 flex items-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setAvailabilityFilter(availabilityFilter === 'all' ? 'available_only' : 'all')
                }
                className={`w-full py-2 px-3.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                  availabilityFilter === 'available_only'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${availabilityFilter === 'available_only' ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
                <span>{availabilityFilter === 'available_only' ? 'Available Only (Filtered)' : 'Filter: Available Only'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-2">
          <div>
            Showing <strong className="text-slate-900">{filteredDonors.length}</strong> donors matching criteria ({availableCount} currently ready to respond)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort:</span>
            <span className="font-semibold text-slate-700">Response Speed & Rating</span>
          </div>
        </div>

        {/* Donors Grid */}
        {filteredDonors.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-red-600 flex items-center justify-center mx-auto">
              <Droplet className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Donors Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn’t find donors matching your specific combination of filters in this location. Try enabling "Show Compatible Donors" or clearing the city filter.
            </p>
            <button
              onClick={() => {
                setSelectedBlood('All');
                setSelectedCity('All Cities');
                setAvailabilityFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Banner accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${donor.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`} />

                <div>
                  {/* Card Header: Avatar, Name, Blood Group */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={donor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                        alt={donor.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs bg-slate-50"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                            {donor.name}
                          </h3>
                          {donor.verified && (
                            <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Medical & ID Profile" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[170px]">{donor.location}, {donor.city}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {donor.age} yrs • {donor.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xl font-black px-3 py-1 rounded-xl bg-red-600 text-white font-mono shadow-xs">
                        {donor.bloodGroup}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          donor.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {donor.isAvailable ? '● Available' : '○ Busy'}
                      </span>
                    </div>
                  </div>

                  {/* Bio / Highlight */}
                  {donor.bio && (
                    <p className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 italic line-clamp-2 mb-4">
                      "{donor.bio}"
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center mb-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Donations</span>
                      <span className="font-extrabold text-slate-800">{donor.totalDonations}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Lives Saved</span>
                      <span className="font-extrabold text-red-600">{donor.livesSaved}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Avg. Speed</span>
                      <span className="font-extrabold text-emerald-700">~{donor.responseTimeMinutes}m</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Last Donation:</span>
                      <strong className="text-slate-800">{donor.lastDonationDate}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Emergency Travel Ready:</span>
                      <strong className={donor.emergencyTravelReady ? 'text-emerald-700' : 'text-slate-500'}>
                        {donor.emergencyTravelReady ? 'Yes (Mobile within 30m)' : 'Standard'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDonorContact(donor)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm shadow-red-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Donor</span>
                  </button>

                  <a
                    href={`sms:${donor.phone}?body=Hello%20${encodeURIComponent(donor.name)},%20urgent%20blood%20request%20via%20LifeLink.`}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                    title="Send SMS"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
