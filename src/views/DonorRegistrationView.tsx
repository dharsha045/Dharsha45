import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import {
  UserPlus,
  Heart,
  Droplet,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight,
  Building2
} from 'lucide-react';
import { MAJOR_CITIES, INDIAN_STATES_AND_CITIES } from '../data/mockData';
import confetti from 'canvas-confetti';

export const DonorRegistrationView: React.FC = () => {
  const { registerDonor, setActiveTab, showToast } = useApp();

  const indianStates = Object.keys(INDIAN_STATES_AND_CITIES);

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [email, setEmail] = useState('');
  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [city, setCity] = useState<string>('Chennai');
  const [pinCode, setPinCode] = useState('');
  const [location, setLocation] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('Never');
  const [neverDonatedBefore, setNeverDonatedBefore] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [emergencyTravelReady, setEmergencyTravelReady] = useState(true);
  const [weightKg, setWeightKg] = useState(65);
  const [bio, setBio] = useState('');
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
    if (!name.trim()) errs.name = 'Full name is required';
    
    // Validate Indian 10-digit mobile number
    const cleanDigits = phoneDigits.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number (+91)';
    }

    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (!location.trim()) errs.location = 'Specific area, colony, or nearest hospital landmark is required';
    if (age < 18 || age > 65) errs.age = 'Age must be between 18 and 65 for safe donation as per NBTC India';
    if (weightKg < 50) errs.weightKg = 'Minimum weight requirement is 50 kg for blood donation';
    if (pinCode.trim() && pinCode.replace(/\D/g, '').length !== 6) {
      errs.pinCode = 'Indian PIN code must be 6 digits';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Validation Error', 'Please check the entered mobile number and required fields.');
      return;
    }

    setIsSubmitting(true);

    const cleanDigits = phoneDigits.replace(/\D/g, '');
    const formattedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;

    setTimeout(() => {
      registerDonor({
        name,
        age,
        gender,
        bloodGroup,
        phone: formattedPhone,
        email,
        state: selectedState,
        city,
        pinCode: pinCode.trim() || undefined,
        location,
        lastDonationDate: neverDonatedBefore ? 'Never' : lastDonationDate,
        isAvailable,
        emergencyTravelReady,
        weightKg,
        bio: bio.trim() || 'Voluntary Indian blood donor ready for emergency medical transfusions.',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      });

      setIsSubmitting(false);

      // Fire celebratory confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#dc2626', '#ef4444', '#f87171', '#10b981']
      });

      setActiveTab('donor-dashboard');
    }, 400);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <UserPlus className="w-3.5 h-3.5" />
            India Volunteer Donor Registration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Register as an Indian Blood Donor
          </h1>
          <p className="text-slate-600 text-sm">
            Join the verified nationwide emergency blood network across all Indian states and cities. Fast SMS and direct phone connectivity (+91).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              Donor Profile Details (India)
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Kannan / Ananya Iyer"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.name
                    ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 bg-slate-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Age, Gender & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age (18-65) *
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  min="50"
                  max="150"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.weightKg && <p className="text-xs text-rose-600 mt-1">{errors.weightKg}</p>}
              </div>
            </div>

            {/* Blood Group Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Blood Group *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {bloodGroups.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2.5 px-2 rounded-xl font-black text-sm transition-all text-center ${
                      bloodGroup === bg
                        ? 'bg-red-600 text-white shadow-md shadow-red-500/25 ring-2 ring-red-300 scale-105'
                        : 'bg-slate-50 text-slate-800 hover:bg-rose-50 border border-slate-200'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Indian Mobile Number (+91) & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (India +91) *
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                  <span className="inline-flex items-center px-3.5 bg-slate-100 text-slate-700 font-bold text-sm border-r border-slate-200 select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
                    placeholder="98401 23456"
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm font-mono focus:outline-none"
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh.kannan@apollohealth.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
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

            {/* Area & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Area / Street / Hospital Zone *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Greams Road / Anna Nagar / Koramangala"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  PIN Code (6 digits)
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

            {/* Last Blood Donation Date */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Last Blood Donation Date
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={neverDonatedBefore}
                    onChange={(e) => setNeverDonatedBefore(e.target.checked)}
                    className="rounded text-red-600 accent-red-600 w-3.5 h-3.5"
                  />
                  <span>First Time Donor (Never donated before)</span>
                </label>
              </div>

              {!neverDonatedBefore && (
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>

            {/* Availability & Emergency Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 cursor-pointer hover:bg-emerald-50 transition-colors">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600 w-4 h-4 mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    Mark Available for Emergency Alerts Now
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    You can toggle your active availability on/off anytime from your donor dashboard.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={emergencyTravelReady}
                  onChange={(e) => setEmergencyTravelReady(e.target.checked)}
                  className="rounded text-red-600 accent-red-600 w-4 h-4 mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Willing to Travel for Critical Code Red Cases (Within 30–45 mins)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Ready to travel to nearby government/private trauma centers and blood banks across {city}.
                  </span>
                </div>
              </label>
            </div>

            {/* Short Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Optional Bio / Donor Note
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Regular voluntary donor. Always glad to assist children's pediatric & thalassemia cases in Chennai."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-red-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>{isSubmitting ? 'Registering Hero Profile...' : 'Complete Donor Registration (+91)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Right Column: Live ID Card Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Live Donor Badge Preview (India)
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Instant Digital Card
                </span>
              </div>

              {/* Digital Card Canvas */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between relative z-10 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold">
                      {name ? name.charAt(0).toUpperCase() : '🇮🇳'}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-rose-300 font-bold">
                        LifeLink India Donor
                      </span>
                      <h4 className="text-base font-bold text-white truncate max-w-[160px]">
                        {name || 'Your Full Name'}
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        {city || 'City'}, {selectedState || 'State'}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-2xl font-black px-3 py-1 rounded-xl bg-red-600 text-white font-mono shadow-md inline-block">
                      {bloodGroup}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs text-slate-300 my-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                    <span className={`font-bold ${isAvailable ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isAvailable ? '● Ready to Donate' : '○ Temporarily Paused'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Travel Support</span>
                    <span className="font-semibold text-white">
                      {emergencyTravelReady ? 'Yes (Mobile in ' + city + ')' : 'Standard'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2">
                  <span>ID: LL-IND-DONOR</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> NBTC India Aligned
                  </span>
                </div>
              </div>

              {/* Perks / Explainer */}
              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>Dedicated +91 direct connection & WhatsApp coordination with verified Indian hospitals.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>Track voluntary donation records and generate recognized donor certificates.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>Instant priority SMS and app alerts for matching emergencies in {selectedState}.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
