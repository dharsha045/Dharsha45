import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Clock, Heart, ArrowRight, UserPlus } from 'lucide-react';

export const DonorEligibilityQuiz: React.FC = () => {
  const { setActiveTab } = useApp();

  const [age, setAge] = useState<number>(26);
  const [weight, setWeight] = useState<number>(65);
  const [lastDonationOption, setLastDonationOption] = useState<string>('more_than_3_months');
  const [hasTattooRecent, setHasTattooRecent] = useState<boolean>(false);
  const [hasFever, setHasFever] = useState<boolean>(false);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [hasChronicCondition, setHasChronicCondition] = useState<boolean>(false);

  // Criteria Evaluation
  const isAgeValid = age >= 18 && age <= 65;
  const isWeightValid = weight >= 50;
  const isIntervalValid = lastDonationOption !== 'less_than_2_months';
  const isHealthValid = !hasTattooRecent && !hasFever && !isPregnant && !hasChronicCondition;

  const isEligible = isAgeValid && isWeightValid && isIntervalValid && isHealthValid;

  const failReasons: string[] = [];
  if (!isAgeValid) failReasons.push('Standard donors must be between 18 and 65 years of age.');
  if (!isWeightValid) failReasons.push('Donor body weight must be at least 50 kg (110 lbs).');
  if (!isIntervalValid) failReasons.push('Minimum interval between standard whole blood donations is 56 days (8 weeks).');
  if (hasTattooRecent) failReasons.push('Tattoos or piercings require a 3-month deferral safety window.');
  if (hasFever) failReasons.push('Please wait until you are fully symptom-free from cold/fever for at least 48 hours.');
  if (isPregnant) failReasons.push('Pregnancy and active nursing require temporary deferral for maternal recovery.');
  if (hasChronicCondition) failReasons.push('Certain chronic cardiovascular or unmanaged conditions require medical clearance.');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Smart Eligibility Screening
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
          Are You Eligible to Donate Blood?
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Take this quick 30-second self-assessment to verify your eligibility and prepare for safe donation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quiz Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Age Slider */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Age: <strong className="text-slate-900 text-sm">{age} Years</strong>
              </label>
              <span className={`text-xs font-bold ${isAgeValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isAgeValid ? '✓ Eligible Age (18-65)' : '✗ Must be 18–65'}
              </span>
            </div>
            <input
              type="range"
              min="16"
              max="75"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>

          {/* Weight Slider */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Body Weight: <strong className="text-slate-900 text-sm">{weight} kg</strong> (~{Math.round(weight * 2.2)} lbs)
              </label>
              <span className={`text-xs font-bold ${isWeightValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isWeightValid ? '✓ Eligible Weight (≥50kg)' : '✗ Minimum 50kg'}
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="130"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>

          {/* Last Donation Date Selector */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              When did you last donate blood?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'never', label: 'First Time Donor' },
                { id: 'more_than_3_months', label: 'Over 2+ Months Ago' },
                { id: 'less_than_2_months', label: 'Within Last 56 Days' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLastDonationOption(opt.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    lastDonationOption === opt.id
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Health Conditions Toggle Matrix */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Health & Temporary Safety Checks
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-100/60">
                <input
                  type="checkbox"
                  checked={hasFever}
                  onChange={(e) => setHasFever(e.target.checked)}
                  className="rounded text-red-600 accent-red-600 w-4 h-4"
                />
                <span className="text-slate-700">Currently have fever / cold</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-100/60">
                <input
                  type="checkbox"
                  checked={hasTattooRecent}
                  onChange={(e) => setHasTattooRecent(e.target.checked)}
                  className="rounded text-red-600 accent-red-600 w-4 h-4"
                />
                <span className="text-slate-700">Tattoo in past 3 months</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-100/60">
                <input
                  type="checkbox"
                  checked={isPregnant}
                  onChange={(e) => setIsPregnant(e.target.checked)}
                  className="rounded text-red-600 accent-red-600 w-4 h-4"
                />
                <span className="text-slate-700">Pregnant or nursing</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-100/60">
                <input
                  type="checkbox"
                  checked={hasChronicCondition}
                  onChange={(e) => setHasChronicCondition(e.target.checked)}
                  className="rounded text-red-600 accent-red-600 w-4 h-4"
                />
                <span className="text-slate-700">Major medical surgery recently</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5">
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-lg transition-all ${
              isEligible
                ? 'bg-gradient-to-br from-emerald-900 to-slate-900 text-white border-emerald-500/40 shadow-emerald-950/30'
                : 'bg-gradient-to-br from-rose-900 to-slate-900 text-white border-rose-500/40 shadow-rose-950/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isEligible ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}
              >
                {isEligible ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-300">Screening Result</span>
                <h4 className="text-2xl font-black font-['Outfit',sans-serif]">
                  {isEligible ? 'You Are Eligible!' : 'Temporary Deferral'}
                </h4>
              </div>
            </div>

            {isEligible ? (
              <div className="space-y-4 text-xs text-slate-200">
                <p className="leading-relaxed">
                  Congratulations! Based on standard clinical guidelines, you meet all core requirements to donate whole blood and platelets.
                </p>

                <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-400/30 space-y-1">
                  <span className="font-bold text-emerald-300 block text-xs">Pre-Donation Best Practices:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                    <li>Drink 500ml extra water/fluid beforehand</li>
                    <li>Eat an iron-rich meal 2-3 hours prior</li>
                    <li>Avoid heavy strenuous exercise right before</li>
                  </ul>
                </div>

                <button
                  onClick={() => setActiveTab('register-donor')}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register as Donor Now</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-200">
                <p className="leading-relaxed">
                  Based on your current responses, you may need a short rest period before your next safe donation:
                </p>

                <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-400/30 space-y-1.5">
                  <span className="font-bold text-rose-300 block text-xs">Items to Address:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-200">
                    {failReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 text-slate-400 text-[11px]">
                  Thank you for your willingness to help! Your health and donor safety come first.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
