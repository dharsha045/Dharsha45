import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Droplet,
  Award,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  Edit,
  Power,
  Siren,
  Hospital,
  ArrowRight,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  Phone
} from 'lucide-react';
import { calculateDaysUntilEligible, COMPATIBLE_RECIPIENTS_MAP } from '../utils/compatibility';

export const DonorDashboardView: React.FC = () => {
  const {
    currentDonor,
    donors,
    setCurrentDonor,
    toggleDonorAvailability,
    donationRecords,
    bloodRequests,
    setActiveRespondRequest,
    setActiveCertificate,
    setActiveTab,
    updateDonor,
    showToast,
  } = useApp();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(currentDonor?.bio || '');

  if (!currentDonor) {
    return (
      <div className="py-16 bg-slate-50 min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Donor Profile Login</h2>
          <p className="text-xs text-slate-500">
            Select a verified demo donor to test the personal donor command dashboard.
          </p>
          <div className="space-y-2 pt-2">
            {donors.slice(0, 4).map((d) => (
              <button
                key={d.id}
                onClick={() => setCurrentDonor(d)}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-red-500 hover:bg-rose-50/50 text-left flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={d.avatar} alt={d.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{d.name}</h4>
                    <p className="text-[10px] text-slate-500">{d.location}, {d.city}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white font-mono font-bold text-xs">
                  {d.bloodGroup}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter donor's personal donation history
  const myDonationRecords = donationRecords.filter((r) => r.donorId === currentDonor.id);

  // Filter nearby blood requests matching donor's blood group and city
  const compatibleRecipients = COMPATIBLE_RECIPIENTS_MAP[currentDonor.bloodGroup] || [currentDonor.bloodGroup];
  const matchingOpenRequests = bloodRequests.filter(
    (req) =>
      req.status === 'Open' &&
      (req.city.toLowerCase() === currentDonor.city.toLowerCase() ||
        compatibleRecipients.includes(req.requiredBloodGroup))
  );

  // Donor eligibility calculation
  const eligibility = calculateDaysUntilEligible(currentDonor.lastDonationDate);

  const handleSaveBio = () => {
    updateDonor(currentDonor.id, { bio: editedBio });
    setIsEditingBio(false);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={currentDonor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                  alt={currentDonor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-lg bg-slate-100"
                />
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-xl bg-red-600 text-white font-mono font-black text-xs shadow-md">
                  {currentDonor.bloodGroup}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                    {currentDonor.name}
                  </h1>
                  {currentDonor.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Hero
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                    <Award className="w-3.5 h-3.5" /> Level {Math.min(5, Math.floor(currentDonor.totalDonations / 3) + 1)} Donor
                  </span>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentDonor.location}, {currentDonor.city}</span>
                  <span className="text-slate-300">•</span>
                  <span>{currentDonor.email}</span>
                </p>

                {/* Bio & Edit */}
                <div className="pt-1">
                  {isEditingBio ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={handleSaveBio}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingBio(false)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 italic flex items-center gap-2">
                      "{currentDonor.bio || 'Dedicated emergency blood donor ready to respond to critical calls.'}"
                      <button
                        onClick={() => {
                          setEditedBio(currentDonor.bio || '');
                          setIsEditingBio(true);
                        }}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Edit Bio"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Availability Toggle Switch */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between sm:justify-start gap-4 self-start lg:self-auto shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Live Emergency Status
                </span>
                <span className={`text-sm font-extrabold flex items-center gap-1.5 ${currentDonor.isAvailable ? 'text-emerald-700' : 'text-slate-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${currentDonor.isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                  {currentDonor.isAvailable ? 'AVAILABLE FOR SOS' : 'PAUSED / BUSY'}
                </span>
              </div>

              <button
                onClick={() => toggleDonorAvailability(currentDonor.id)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  currentDonor.isAvailable
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{currentDonor.isAvailable ? 'Set to Paused' : 'Set to Available'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Lives Saved</span>
              <span className="text-2xl font-black text-red-600 font-['Outfit',sans-serif]">
                {currentDonor.livesSaved} Lives
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Across {currentDonor.totalDonations} donations</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Avg. Response Time</span>
              <span className="text-2xl font-black text-slate-800 font-['Outfit',sans-serif]">
                ~{currentDonor.responseTimeMinutes} mins
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Top 5% rapid responder</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Donor Rating</span>
              <span className="text-2xl font-black text-amber-600 font-['Outfit',sans-serif]">
                ★ {currentDonor.rating} / 5.0
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Hospital verified reliability</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Next Eligible Donation</span>
              <span className={`text-xl font-black font-['Outfit',sans-serif] ${eligibility.isEligible ? 'text-emerald-700' : 'text-slate-800'}`}>
                {eligibility.isEligible ? 'Eligible Now' : `In ${eligibility.daysRemaining} Days`}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Last: {currentDonor.lastDonationDate}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Nearby Urgent Blood Requests */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Siren className="w-5 h-5 text-red-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Nearby Requests Matching Your Blood ({currentDonor.bloodGroup})
                  </h3>
                </div>
                <span className="text-xs text-red-600 font-bold bg-red-50 px-2.5 py-0.5 rounded-full">
                  {matchingOpenRequests.length} Open
                </span>
              </div>

              {matchingOpenRequests.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  No open emergency requests in your area for your blood group right now. Thank you for staying on standby!
                </div>
              ) : (
                <div className="space-y-3">
                  {matchingOpenRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-rose-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{req.patientName}</span>
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-xs">
                            {req.requiredBloodGroup}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            req.emergencyLevel === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.emergencyLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <Hospital className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.hospitalName}, {req.city}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Required: {req.requiredDate} • {req.unitsNeeded} unit(s)
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveRespondRequest(req)}
                        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>I Can Donate</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Donation Records & History */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900">Your Blood Donation History</h3>
                </div>
                <span className="text-xs text-slate-500">
                  {myDonationRecords.length} Recorded Sessions
                </span>
              </div>

              {myDonationRecords.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs">
                  <Droplet className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  No completed donations logged yet under this profile. When you respond and complete a donation at a hospital, your certificate will appear here!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {myDonationRecords.map((record) => (
                    <div
                      key={record.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{record.hospitalName}</h4>
                          <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-mono text-[10px] font-bold">
                            {record.bloodGroup} ({record.units} unit)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Donated on {record.donationDate} • {record.city}
                        </p>
                        {record.patientName && (
                          <p className="text-[11px] text-emerald-700 font-medium">
                            Transfused to: {record.patientName}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveCertificate(record)}
                        className="py-1.5 px-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-rose-50 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Cols: Badges, Impact Level, Switch Persona */}
          <div className="lg:col-span-5 space-y-6">
            {/* Life Saver Tier Card */}
            <div className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white p-6 rounded-3xl shadow-xl shadow-red-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-200">
                  National Donor Tier
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                  Top 5%
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xl font-black font-['Outfit',sans-serif]">
                    Gold Life Saver Guardian
                  </h4>
                  <p className="text-xs text-rose-100">
                    Awarded for maintaining regular verified emergency blood donations
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-rose-100">
                  <span>Progress to Platinum Guardian</span>
                  <span>{currentDonor.totalDonations} / 20 Donations</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (currentDonor.totalDonations / 20) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Quick Shortcuts
              </h4>

              <button
                onClick={() => setActiveTab('emergency-alerts')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-red-400 hover:bg-rose-50/50 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Siren className="w-4 h-4 text-red-600" />
                  <span>Open Live Emergency Feed</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('compatibility-guide')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Transfusion Compatibility Matrix</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('eligibility-checker')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Eligibility Self-Assessment</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
