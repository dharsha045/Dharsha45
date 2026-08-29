import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, EmergencyLevel } from '../types';
import {
  Droplet,
  Siren,
  Hospital,
  MapPin,
  Phone,
  User,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2
} from 'lucide-react';
import { MAJOR_CITIES, HOSPITAL_LIST, INDIAN_STATES_AND_CITIES } from '../data/mockData';

export const BloodRequestView: React.FC = () => {
  const { createBloodRequest, setActiveTab, showToast, donors } = useApp();

  const indianStates = Object.keys(INDIAN_STATES_AND_CITIES);

  const [patientName, setPatientName] = useState('');
  const [requiredBloodGroup, setRequiredBloodGroup] = useState<BloodGroup>('O-');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [hospitalName, setHospitalName] = useState(HOSPITAL_LIST[0]);
  const [customHospital, setCustomHospital] = useState('');
  const [useCustomHospital, setUseCustomHospital] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [city, setCity] = useState<string>('Chennai');
  const [location, setLocation] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [contactDigits, setContactDigits] = useState('');
  const [alternateDigits, setAlternateDigits] = useState('');
  const [requiredDate, setRequiredDate] = useState('Within 2 Hours (Immediate)');
  const [emergencyLevel, setEmergencyLevel] = useState<EmergencyLevel>('Critical');
  const [reason, setReason] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const availableCities = INDIAN_STATES_AND_CITIES[selectedState] || [city];

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const citiesInState = INDIAN_STATES_AND_CITIES[newState] || [];
    if (citiesInState.length > 0) {
      setCity(citiesInState[0]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!patientName.trim()) errs.patientName = 'Patient full name is required';
    
    const cleanDigits = contactDigits.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length !== 10) {
      errs.contactNumber = 'Enter a valid 10-digit Indian mobile number (+91)';
    }

    if (!requesterName.trim()) errs.requesterName = 'Doctor, nurse, or family contact name is required';
    if (useCustomHospital && !customHospital.trim()) errs.customHospital = 'Hospital / Blood Bank name is required';
    if (!location.trim()) errs.location = 'Hospital department, ward, or room number is required';
    if (pinCode.trim() && pinCode.replace(/\D/g, '').length !== 6) {
      errs.pinCode = 'Indian PIN code must be 6 digits';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const potentialDonorsCount = donors.filter(
    (d) => d.bloodGroup === requiredBloodGroup && d.city.toLowerCase() === city.toLowerCase()
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Validation Error', 'Please check the Indian contact number and required fields.');
      return;
    }

    setIsSubmitting(true);

    const cleanMain = contactDigits.replace(/\D/g, '');
    const formattedMain = `+91 ${cleanMain.slice(0, 5)} ${cleanMain.slice(5)}`;

    const cleanAlt = alternateDigits.replace(/\D/g, '');
    const formattedAlt = cleanAlt.length === 10 ? `+91 ${cleanAlt.slice(0, 5)} ${cleanAlt.slice(5)}` : undefined;

    setTimeout(() => {
      const finalHospital = useCustomHospital ? customHospital : hospitalName;

      createBloodRequest({
        patientName,
        requiredBloodGroup,
        unitsNeeded,
        hospitalName: finalHospital,
        location,
        state: selectedState,
        city,
        pinCode: pinCode.trim() || undefined,
        contactNumber: formattedMain,
        alternateContact: formattedAlt,
        requiredDate,
        emergencyLevel,
        reason: reason.trim() || 'Urgent medical transfusion requirement in India.',
        requesterName,
        notes: notes.trim() || undefined,
      });

      setIsSubmitting(false);
      setActiveTab('emergency-alerts');
    }, 400);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Siren className="w-3.5 h-3.5 animate-pulse" />
            Emergency Request Dispatch (India)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Post a Blood Request in India
          </h1>
          <p className="text-slate-600 text-sm">
            Broadcast emergency requests instantly to matching volunteer donors across Indian cities with direct +91 calling and WhatsApp alert dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            {/* Urgency Level Selector */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Emergency Priority Level *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    level: 'Critical' as EmergencyLevel,
                    label: 'Critical / Code Red',
                    desc: 'Emergency surgery / accident',
                    icon: Siren,
                    color: 'border-red-500 bg-red-50 text-red-700',
                  },
                  {
                    level: 'Urgent' as EmergencyLevel,
                    label: 'Urgent Priority',
                    desc: 'Required within 6–12h',
                    icon: AlertTriangle,
                    color: 'border-amber-500 bg-amber-50 text-amber-800',
                  },
                  {
                    level: 'Normal' as EmergencyLevel,
                    label: 'Standard Need',
                    desc: 'Scheduled elective care',
                    icon: Clock,
                    color: 'border-blue-500 bg-blue-50 text-blue-800',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = emergencyLevel === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => setEmergencyLevel(item.level)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? `${item.color} ring-2 ring-red-400 shadow-sm`
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-5 h-5" />
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-red-600 animate-ping' : 'bg-slate-300'}`} />
                      </div>
                      <div>
                        <span className="font-bold text-xs block">{item.label}</span>
                        <span className="text-[10px] opacity-80">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Blood Group & Units */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Required Blood Group *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {bloodGroups.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setRequiredBloodGroup(bg)}
                    className={`py-2.5 px-2 rounded-xl font-black text-sm transition-all text-center ${
                      requiredBloodGroup === bg
                        ? 'bg-red-600 text-white shadow-md shadow-red-500/25 ring-2 ring-red-300 scale-105'
                        : 'bg-slate-50 text-slate-800 hover:bg-rose-50 border border-slate-200'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Units Needed & Required Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Blood Units Needed *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    required
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                    Unit(s) (~350-450 ml/unit)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Timeline / Date *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Within 2 Hours (Immediate)">Within 2 Hours (Immediate Code Red)</option>
                    <option value="Within 6 Hours (Today)">Within 6 Hours (Today)</option>
                    <option value="Today Evening (18:00 - 21:00)">Today Evening (18:00 - 21:00)</option>
                    <option value="Tomorrow Morning (08:00 - 12:00)">Tomorrow Morning (08:00 - 12:00)</option>
                    <option value="Scheduled for This Weekend">Scheduled for This Weekend</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Patient Name & Requester Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Master Arjun Sundaram / Sunita Verma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                {errors.patientName && <p className="text-xs text-rose-600 mt-1">{errors.patientName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Requester / Doctor / Relative Name *
                </label>
                <input
                  type="text"
                  required
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="e.g. Dr. K. S. Balaji (Surgeon) / Deepak Patil (Son)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.requesterName && <p className="text-xs text-rose-600 mt-1">{errors.requesterName}</p>}
              </div>
            </div>

            {/* Indian State & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Indian State / UT *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hospital Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hospital / Blood Bank *
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomHospital(!useCustomHospital)}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  {useCustomHospital ? 'Choose from known medical centres' : 'Not in list? Enter hospital name'}
                </button>
              </div>

              {useCustomHospital ? (
                <input
                  type="text"
                  required
                  value={customHospital}
                  onChange={(e) => setCustomHospital(e.target.value)}
                  placeholder="Enter Hospital / Trauma Center / Blood Bank Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <div className="relative">
                  <Hospital className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {HOSPITAL_LIST.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Ward Location & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hospital Ward / Room / Trauma Bay *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. ICU Floor 2 / Trauma Bay 3 / Blood Bank Desk"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  PIN Code (Optional)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 600006"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.pinCode && <p className="text-xs text-rose-600 mt-1">{errors.pinCode}</p>}
              </div>
            </div>

            {/* Contact Phones (+91) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Mobile (+91) *
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                  <span className="inline-flex items-center px-3.5 bg-slate-100 text-slate-700 font-bold text-sm border-r border-slate-200 select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={contactDigits}
                    onChange={(e) => setContactDigits(e.target.value.replace(/\D/g, ''))}
                    placeholder="98401 99887"
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm font-mono focus:outline-none"
                  />
                </div>
                {errors.contactNumber && <p className="text-xs text-rose-600 mt-1">{errors.contactNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alternate Mobile (Optional)
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 focus-within:ring-2 focus-within:ring-red-500">
                  <span className="inline-flex items-center px-3.5 bg-slate-100 text-slate-700 font-bold text-sm border-r border-slate-200 select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={alternateDigits}
                    onChange={(e) => setAlternateDigits(e.target.value.replace(/\D/g, ''))}
                    placeholder="98401 99888"
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Medical Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Medical Reason / Surgical Case Description
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Emergency surgery / acute hemorrhagic shock / leukemia platelet requirement."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 text-white ${
                emergencyLevel === 'Critical'
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30 ring-2 ring-red-300'
                  : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Broadcasting to Donors in India...' : 'Broadcast Emergency Blood Request (+91)'}</span>
            </button>
          </form>

          {/* Right Column: Live Broadcast Preview & Matching Stats */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Request Card Preview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Live Emergency Feed Preview (India)
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  <Siren className="w-3.5 h-3.5" />
                  Public Alert Card
                </span>
              </div>

              {/* Preview Card */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  emergencyLevel === 'Critical'
                    ? 'border-red-400 bg-rose-50/40 ring-1 ring-red-500/20'
                    : emergencyLevel === 'Urgent'
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black px-3 py-1 rounded-xl bg-red-600 text-white font-mono shadow-xs">
                      {requiredBloodGroup}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
                      {unitsNeeded} {unitsNeeded > 1 ? 'Units' : 'Unit'}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      emergencyLevel === 'Critical'
                        ? 'bg-red-600 text-white'
                        : emergencyLevel === 'Urgent'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {emergencyLevel} Priority
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {patientName || 'Patient Name (e.g. Master Arjun)'}
                </h4>

                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                  <Hospital className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">
                    {useCustomHospital ? (customHospital || 'Hospital Name') : hospitalName}, {city}
                  </span>
                </p>

                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{location || 'Trauma Bay / Ward'}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span>Req. Timeline: <strong>{requiredDate}</strong></span>
                  <span className="text-red-700 font-bold">🇮🇳 India +91</span>
                </div>
              </div>

              {/* Matching Donors in Indian City */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Matching {requiredBloodGroup} Donors in {city}:</span>
                  <span className="font-extrabold text-red-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    {potentialDonorsCount} Available
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upon posting, automated emergency alerts and priority SMS will be routed immediately to registered voluntary lifesavers across {city}, {selectedState}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
