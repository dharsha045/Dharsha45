import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyLevel, BloodRequest } from '../types';
import { Siren, Clock, MapPin, Hospital, Phone, HeartHandshake, AlertCircle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export const EmergencyAlertsSection: React.FC = () => {
  const { bloodRequests, setActiveTab, setActiveRespondRequest } = useApp();
  const [filterLevel, setFilterLevel] = useState<EmergencyLevel | 'All'>('All');

  const openRequests = bloodRequests.filter((r) => r.status === 'Open');
  const filtered = openRequests.filter(
    (r) => filterLevel === 'All' || r.emergencyLevel === filterLevel
  );

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
              <Siren className="w-3.5 h-3.5 animate-pulse" />
              Live Emergency Triage Feed
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
              Urgent Blood Requests
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Patients and hospitals actively awaiting life-saving blood units. Every minute matters.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto">
            {(['All', 'Critical', 'Urgent', 'Normal'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterLevel === lvl
                    ? lvl === 'Critical'
                      ? 'bg-red-600 text-white shadow-xs'
                      : lvl === 'Urgent'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {lvl} {lvl === 'Critical' ? '🚨' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Request Cards Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">No Active Urgent Blood Shortages</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {bloodRequests.length === 0
                  ? 'There are currently no active blood requests in the registry. If you or a hospital in India needs urgent blood units, post a request right now.'
                  : 'All emergency requests matching this filter have been fulfilled by volunteer donors.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('request-blood')}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                + Post Emergency Blood Request (+91)
              </button>
              <button
                onClick={() => setActiveTab('find-donor')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
              >
                Browse Voluntary Donors
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 6).map((req) => (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm transition-all hover:shadow-xl relative flex flex-col justify-between overflow-hidden ${
                  req.emergencyLevel === 'Critical'
                    ? 'border-red-300 ring-1 ring-red-500/20 hover:border-red-400'
                    : req.emergencyLevel === 'Urgent'
                    ? 'border-amber-200 hover:border-amber-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Critical Glow Indicator */}
                {req.emergencyLevel === 'Critical' && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse" />
                )}

                <div>
                  {/* Top Row: Blood Group & Emergency Level */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black px-3.5 py-1.5 rounded-2xl bg-red-600 text-white font-mono shadow-sm">
                        {req.requiredBloodGroup}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                        {req.unitsNeeded} {req.unitsNeeded > 1 ? 'Units' : 'Unit'} Needed
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                        req.emergencyLevel === 'Critical'
                          ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                          : req.emergencyLevel === 'Urgent'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {req.emergencyLevel === 'Critical' && <Siren className="w-3.5 h-3.5" />}
                      {req.emergencyLevel}
                    </span>
                  </div>

                  {/* Patient & Hospital Info */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{req.patientName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Hospital className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{req.hospitalName}</span>
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{req.location || req.city}</span>
                      </p>
                    </div>

                    {req.reason && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic line-clamp-2">
                        "{req.reason}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer & Action */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Req. Date: <strong className="text-slate-800 font-semibold">{req.requiredDate}</strong>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {req.responsesCount} {req.responsesCount === 1 ? 'Donor Responded' : 'Donors Responded'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveRespondRequest(req)}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                        req.emergencyLevel === 'Critical'
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/25'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>I Can Donate</span>
                    </button>

                    <a
                      href={`tel:${req.contactNumber}`}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      title="Call Contact Directly"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => setActiveTab('emergency-alerts')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-sm transition-all hover:border-slate-400"
          >
            <span>View All Live Emergency Alerts ({bloodRequests.length})</span>
            <ArrowRight className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
