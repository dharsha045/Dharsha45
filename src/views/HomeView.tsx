import React from 'react';
import { HomeHero } from '../components/HomeHero';
import { HomeStats } from '../components/HomeStats';
import { EmergencyAlertsSection } from '../components/EmergencyAlertsSection';
import { HowItWorks } from '../components/HowItWorks';
import { BloodCompatibilityMatrix } from '../components/BloodCompatibilityMatrix';
import { DonorEligibilityQuiz } from '../components/DonorEligibilityQuiz';
import { useApp } from '../context/AppContext';
import { Heart, UserPlus, Search, Droplet, Siren, ShieldCheck } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="space-y-0 animate-fade-in">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Live Statistics */}
      <HomeStats />

      {/* 3. Emergency Blood Requests Section */}
      <EmergencyAlertsSection />

      {/* 4. How It Works Section */}
      <HowItWorks />

      {/* 5. Educational & Clinical Section (Compatibility & Eligibility) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <BloodCompatibilityMatrix />
          <DonorEligibilityQuiz />
        </div>
      </section>

      {/* 6. Community Callout Banner */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md text-white mx-auto flex items-center justify-center shadow-lg">
            <Heart className="w-8 h-8 fill-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-['Outfit',sans-serif]">
            Every 2 Seconds, Someone Needs Blood
          </h2>

          <p className="text-rose-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            One single blood donation can save up to 3 lives. Join thousands of heroes in your city and stay prepared for local medical emergencies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('register-donor')}
              className="px-8 py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-red-700 font-extrabold text-sm sm:text-base shadow-xl transition-all hover:scale-105"
            >
              Join LifeLink Registry
            </button>

            <button
              onClick={() => setActiveTab('request-blood')}
              className="px-8 py-3.5 rounded-2xl bg-red-900/60 hover:bg-red-900 text-white font-bold text-sm sm:text-base border border-white/20 transition-all"
            >
              Post Urgent Request
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
