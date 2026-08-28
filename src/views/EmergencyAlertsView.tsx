import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyLevel, BloodGroup, RequestStatus } from '../types';
import {
  Siren,
  Clock,
  MapPin,
  Hospital,
  Phone,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Filter,
  Users,
  Search,
  Check,
  Share2,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { MAJOR_CITIES } from '../data/mockData';

export const EmergencyAlertsView: React.FC = () => {
  const {
    bloodRequests,
    setActiveRespondRequest,
    simulateIncomingEmergency,
    markRequestFulfilled,
    showToast,
    setActiveTab,
    isSoundEnabled,
    toggleSound,
    isLiveSimulationActive,
    toggleLiveSimulation,
  } = useApp();

  const [levelFilter, setLevelFilter] = useState<EmergencyLevel | 'All'>('All');
  const [bloodFilter, setBloodFilter] = useState<BloodGroup | 'All'>('All');
  const [cityFilter, setCityFilter] = useState<string>('All Cities');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Fulfilled'>('Open');

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const filteredRequests = bloodRequests.filter((req) => {
    if (levelFilter !== 'All' && req.emergencyLevel !== levelFilter) return false;
    if (bloodFilter !== 'All' && req.requiredBloodGroup !== bloodFilter) return false;
    if (cityFilter !== 'All Cities' && req.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (statusFilter !== 'All' && req.status !== statusFilter) return false;
    return true;
  });

  const criticalCount = bloodRequests.filter((r) => r.emergencyLevel === 'Critical' && r.status === 'Open').length;
  const urgentCount = bloodRequests.filter((r) => r.emergencyLevel === 'Urgent' && r.status === 'Open').length;

  const handleShare = (req: typeof bloodRequests[0]) => {
    if (navigator.share) {
      navigator.share({
        title: `🚨 Emergency ${req.requiredBloodGroup} Blood Needed`,
        text: `Urgent blood request for ${req.patientName} at ${req.hospitalName}, ${req.city}. Can you donate?`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `🚨 EMERGENCY ${req.requiredBloodGroup} BLOOD NEEDED: ${req.patientName} at ${req.hospitalName}, ${req.city}. Contact: ${req.contactNumber}`
      );
      showToast('info', 'Alert Copied', 'Emergency broadcast details copied to clipboard.');
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Stats Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-red-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-rose-100">
              <Siren className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              Live Emergency SOS Command Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-['Outfit',sans-serif]">
              Emergency Blood Alerts
            </h1>
            <p className="text-rose-100 text-sm max-w-xl">
              Real-time priority feed of verified trauma center blood calls. Critical requests receive instant hospital dispatch priority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={toggleSound}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border ${
                isSoundEnabled ? 'bg-red-800/80 hover:bg-red-800 text-white border-white/20' : 'bg-red-950/60 text-rose-200 border-white/10'
              }`}
              title={isSoundEnabled ? 'Mute Alert Sound Chimes' : 'Enable Alert Sound Chimes'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-rose-200" /> : <VolumeX className="w-4 h-4 text-rose-300" />}
              <span>{isSoundEnabled ? 'Sound: ON' : 'Muted'}</span>
            </button>

            <button
              onClick={toggleLiveSimulation}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border ${
                isLiveSimulationActive ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400' : 'bg-red-800/80 hover:bg-red-800 text-white border-white/20'
              }`}
              title="Automatically stream simulated urgent emergencies every 35s"
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveSimulationActive ? 'animate-pulse' : ''}`} />
              <span>{isLiveSimulationActive ? 'Auto-Stream: ON' : 'Auto-Stream'}</span>
            </button>

            <button
              onClick={simulateIncomingEmergency}
              className="px-4 py-2.5 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow-md hover:bg-rose-50 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Simulate SOS Alert
            </button>
            
            <button
              onClick={() => setActiveTab('request-blood')}
              className="px-4 py-2.5 rounded-xl bg-red-900/70 hover:bg-red-900 text-white font-bold text-xs border border-white/20 transition-all"
            >
              + Post Request
            </button>
          </div>
        </div>

        {/* Priority Filter Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {/* Top Triage Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLevelFilter('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  levelFilter === 'All'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Urgencies ({bloodRequests.length})
              </button>

              <button
                onClick={() => setLevelFilter('Critical')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  levelFilter === 'Critical'
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/25 ring-2 ring-red-300'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <Siren className="w-3.5 h-3.5 animate-pulse" />
                Critical Code Red ({criticalCount})
              </button>

              <button
                onClick={() => setLevelFilter('Urgent')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  levelFilter === 'Urgent'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Urgent ({urgentCount})
              </button>
            </div>

            {/* Status switcher (Open vs Fulfilled) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['Open', 'Fulfilled', 'All'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st === 'Open' ? 'Active SOS' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters: Blood & City */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-500 mr-2">Blood Group:</span>
              <button
                onClick={() => setBloodFilter('All')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  bloodFilter === 'All'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBloodFilter(bg)}
                  className={`px-2.5 py-1 rounded-lg font-black font-mono transition-all ${
                    bloodFilter === bg
                      ? 'bg-red-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-red-700'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            <div className="sm:col-span-4 flex items-center justify-end">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {MAJOR_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requests Feed Cards */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No matching emergency alerts</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no active emergency blood requests matching this combination of filters.
            </p>
            <button
              onClick={() => {
                setLevelFilter('All');
                setBloodFilter('All');
                setCityFilter('All Cities');
                setStatusFilter('Open');
              }}
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm transition-all hover:shadow-lg relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                  req.emergencyLevel === 'Critical' && req.status === 'Open'
                    ? 'border-red-400 bg-rose-50/20 ring-1 ring-red-500/20'
                    : req.emergencyLevel === 'Urgent' && req.status === 'Open'
                    ? 'border-amber-300'
                    : 'border-slate-200'
                }`}
              >
                {/* Left accent ribbon */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-2 ${
                    req.status === 'Fulfilled'
                      ? 'bg-emerald-500'
                      : req.emergencyLevel === 'Critical'
                      ? 'bg-red-600 animate-pulse'
                      : req.emergencyLevel === 'Urgent'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                />

                {/* Patient & Hospital Specs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pl-2">
                  {/* Blood Group Circle */}
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-red-600 text-white font-mono shrink-0 shadow-md">
                    <span className="text-xl font-black">{req.requiredBloodGroup}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                      {req.unitsNeeded} {req.unitsNeeded > 1 ? 'Units' : 'Unit'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{req.patientName}</h3>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                          req.status === 'Fulfilled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.emergencyLevel === 'Critical'
                            ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                            : req.emergencyLevel === 'Urgent'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {req.status === 'Fulfilled' ? (
                          <>
                            <Check className="w-3 h-3" /> Fulfilled
                          </>
                        ) : (
                          <>
                            {req.emergencyLevel === 'Critical' && <Siren className="w-3 h-3" />}
                            {req.emergencyLevel} Priority
                          </>
                        )}
                      </span>

                      {req.status === 'In Progress' && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                          ● Donor Dispatched ({req.assignedDonorName})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                      <Hospital className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.hospitalName}</span>
                      <span className="text-slate-300">•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.location || req.city}</span>
                    </p>

                    {req.reason && (
                      <p className="text-xs text-slate-500 italic max-w-xl">
                        "{req.reason}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Timeline: <strong className="text-slate-700">{req.requiredDate}</strong>
                      </span>
                      <span>
                        Requester: <strong className="text-slate-700">{req.requesterName}</strong>
                      </span>
                      <span>
                        Responses: <strong className="text-red-600">{req.responsesCount} Donors</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 pl-2 lg:pl-0 shrink-0">
                  {req.status === 'Open' ? (
                    <>
                      <button
                        onClick={() => setActiveRespondRequest(req)}
                        className={`py-3 px-5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 text-white ${
                          req.emergencyLevel === 'Critical'
                            ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25 ring-2 ring-red-300 animate-pulse'
                            : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        <span>I Can Donate</span>
                      </button>

                      <a
                        href={`tel:${req.contactNumber}`}
                        className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                        title={`Call ${req.contactNumber}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleShare(req)}
                        className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                        title="Share Emergency SOS Alert"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : req.status === 'In Progress' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markRequestFulfilled(req.id)}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Complete & Mark Fulfilled
                      </button>
                      <a
                        href={`tel:${req.contactNumber}`}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Fulfilled & Transfused
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
