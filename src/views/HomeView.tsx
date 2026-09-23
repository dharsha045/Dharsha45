import React from 'react';
import { HomeHero } from '../components/HomeHero';
import { HowItWorks } from '../components/HowItWorks';
import { HomeStats } from '../components/HomeStats';
import { BloodCompatibilityMatrix } from '../components/BloodCompatibilityMatrix';
import { DonorEligibilityQuiz } from '../components/DonorEligibilityQuiz';
import { ShieldCheck, Lock, Activity, HeartHandshake } from 'lucide-react';

export const HomeView: React.FC = () => {
  return (
    <div className="space-y-0 animate-fade-in">
      {/* 1. Hero Section (Includes compact status indicator, hero headline, 2 primary actions, and quick donor search) */}
      <HomeHero />

      {/* 2. How LifeLink Works */}
      <HowItWorks />

      {/* 3. Trust / Safety & Clinical Standards Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-16">
          {/* Trust & Safety Header & Badges */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">
              Verified Clinical Standards
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
              Trust, Safety & Medical Integrity
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              LifeLink operates under strict healthcare protocols aligned with the National Blood Transfusion Council (NBTC) and WHO guidelines.
            </p>

            {/* 4 Trust Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 text-left">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="text-xs font-bold text-slate-900">100% Voluntary</h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Non-remunerated ethical blood donation only.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <Lock className="w-5 h-5 text-blue-600 mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Data Privacy</h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Secure contact masking and verified communications.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <Activity className="w-5 h-5 text-red-600 mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Mandatory Screening</h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Clinical infection and cross-match verification.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <HeartHandshake className="w-5 h-5 text-amber-600 mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Hospital Linked</h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Direct integration with trauma center blood banks.</p>
              </div>
            </div>
          </div>

          {/* Live Verified Network Statistics */}
          <HomeStats />

          {/* Clinical Transfusion Compatibility Matrix */}
          <BloodCompatibilityMatrix />

          {/* Medical Donor Eligibility Assessment Quiz */}
          <DonorEligibilityQuiz />
        </div>
      </section>
    </div>
  );
};

