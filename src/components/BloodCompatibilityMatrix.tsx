import React, { useState } from 'react';
import { BloodGroup } from '../types';
import {
  COMPATIBLE_DONORS_MAP,
  COMPATIBLE_RECIPIENTS_MAP,
  BLOOD_GROUP_INFO,
  canDonateBlood,
} from '../utils/compatibility';
import { Sparkles, Heart, Check, X, Info, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BloodCompatibilityMatrix: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');

  const allGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const info = BLOOD_GROUP_INFO[selectedGroup];
  const canDonateTo = COMPATIBLE_RECIPIENTS_MAP[selectedGroup];
  const canReceiveFrom = COMPATIBLE_DONORS_MAP[selectedGroup];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Medical Science Guide
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Blood Type Compatibility Matrix
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Click any blood group below to inspect transfusion compatibility, rarity, and clinical recommendations.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('find-donor')}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all self-start md:self-auto"
        >
          Find {selectedGroup} Donors
        </button>
      </div>

      {/* Blood Group Selector Chips */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
        {allGroups.map((bg) => (
          <button
            key={bg}
            onClick={() => setSelectedGroup(bg)}
            className={`py-3 px-2 rounded-2xl font-black text-base sm:text-lg transition-all flex flex-col items-center justify-center gap-1 ${
              selectedGroup === bg
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105 ring-2 ring-red-300'
                : 'bg-slate-50 hover:bg-rose-50 text-slate-800 hover:text-red-700 border border-slate-200'
            }`}
          >
            <span>{bg}</span>
            <span className={`text-[10px] font-semibold ${selectedGroup === bg ? 'text-rose-100' : 'text-slate-400'}`}>
              {BLOOD_GROUP_INFO[bg].rarityPercentage}% Pop.
            </span>
          </button>
        ))}
      </div>

      {/* Selected Blood Group Card */}
      <div className="bg-gradient-to-br from-rose-50/60 via-white to-slate-50 p-6 rounded-3xl border border-rose-200/80 shadow-inner grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Badge & Highlights */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-2xl font-mono shadow-md">
              {selectedGroup}
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">{info.name}</h4>
              <p className="text-xs text-red-600 font-bold">
                ~{info.rarityPercentage}% of the Global Population
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-2xl border border-rose-100">
            {info.description}
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {info.isUniversalDonor && (
              <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Universal Red Cell Donor
              </span>
            )}
            {info.isUniversalRecipient && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Universal Recipient
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
              Best Donation: {info.idealDonationType}
            </span>
          </div>
        </div>

        {/* Right: Compatibility Breakdown */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Can Give To */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-600" />
                Can Donate Red Cells To
              </span>
              <span className="text-xs font-bold text-red-600 font-mono">
                {canDonateTo.length} Blood Types
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {allGroups.map((bg) => {
                const isCompatible = canDonateTo.includes(bg);
                return (
                  <span
                    key={bg}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold flex items-center gap-1 transition-all ${
                      isCompatible
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-slate-50 text-slate-300 border border-slate-100 opacity-50'
                    }`}
                  >
                    {isCompatible ? <Check className="w-3 h-3 text-red-600" /> : <X className="w-3 h-3 text-slate-300" />}
                    {bg}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Can Receive From */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-600" />
                Can Receive Red Cells From
              </span>
              <span className="text-xs font-bold text-emerald-600 font-mono">
                {canReceiveFrom.length} Blood Types
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {allGroups.map((bg) => {
                const isCompatible = canReceiveFrom.includes(bg);
                return (
                  <span
                    key={bg}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold flex items-center gap-1 transition-all ${
                      isCompatible
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 text-slate-300 border border-slate-100 opacity-50'
                    }`}
                  >
                    {isCompatible ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                    {bg}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Full Cross-Match Table */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Complete 8x8 Transfusion Compatibility Grid
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3 text-left">Donor ↓ / Recipient →</th>
                {allGroups.map((r) => (
                  <th
                    key={r}
                    className={`p-3 font-mono font-bold ${
                      r === selectedGroup ? 'bg-red-100 text-red-800' : ''
                    }`}
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allGroups.map((d) => (
                <tr
                  key={d}
                  className={`hover:bg-slate-50 transition-colors ${
                    d === selectedGroup ? 'bg-rose-50/70 font-semibold' : ''
                  }`}
                >
                  <td className="p-3 text-left font-mono font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center text-xs">
                      {d}
                    </span>
                    <span className="text-slate-600 font-normal hidden sm:inline">{BLOOD_GROUP_INFO[d].name}</span>
                  </td>
                  {allGroups.map((r) => {
                    const match = canDonateBlood(d, r);
                    const isFocus = d === selectedGroup || r === selectedGroup;
                    return (
                      <td
                        key={r}
                        className={`p-3 ${
                          isFocus ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        {match ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold shadow-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="text-slate-200 font-light">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
