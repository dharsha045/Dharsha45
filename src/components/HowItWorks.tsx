import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Search, Bell, Heart, Shield, Hospital, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeWorkflow, setActiveWorkflow] = useState<'donor' | 'patient'>('donor');

  const donorSteps = [
    {
      step: '01',
      title: 'Register in 60 Seconds',
      description: 'Add your blood group, location, contact details, and current availability status to join the national emergency registry.',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Receive Instant SOS Alerts',
      description: 'Get notified via SMS and in-app alerts whenever a hospital or emergency patient in your city requires your blood type.',
      icon: Bell,
    },
    {
      step: '03',
      title: 'Respond & Coordinate',
      description: 'Accept the emergency call, get direct hospital trauma directions, and indicate your arrival time with a single tap.',
      icon: Hospital,
    },
    {
      step: '04',
      title: 'Save Lives & Earn Recognition',
      description: 'Donate safely, track your total lives saved, and receive official verified Life Saver Certificates of Appreciation.',
      icon: Heart,
    },
  ];

  const patientSteps = [
    {
      step: '01',
      title: 'Post Emergency Blood Request',
      description: 'Specify required blood group, units needed, patient details, hospital trauma center, and urgency level (Critical / Urgent / Normal).',
      icon: Search,
    },
    {
      step: '02',
      title: 'Smart Geo-Matching Broadcast',
      description: 'LifeLink immediately alerts all compatible, available registered donors located within direct proximity to the hospital.',
      icon: Shield,
    },
    {
      step: '03',
      title: 'Direct Donor Connection',
      description: 'Receive verified donor responses with estimated arrival times, direct phone lines, and donor reliability ratings.',
      icon: Bell,
    },
    {
      step: '04',
      title: 'Safe Transfusion & Recovery',
      description: 'Donors arrive at the hospital blood bank for rapid cross-matching and life-saving emergency transfusion.',
      icon: CheckCircle2,
    },
  ];

  const currentSteps = activeWorkflow === 'donor' ? donorSteps : patientSteps;

  return (
    <section className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">
            Simple & Transparent Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            How LifeLink Works
          </h2>
          <p className="text-slate-600 text-sm">
            Bridging the crucial minutes between emergency blood requirements and verified volunteer donors.
          </p>

          {/* Persona Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mt-4">
            <button
              onClick={() => setActiveWorkflow('donor')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeWorkflow === 'donor'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Donors (Save Lives)
            </button>
            <button
              onClick={() => setActiveWorkflow('patient')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeWorkflow === 'patient'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Patients & Hospitals
            </button>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentSteps.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/60 rounded-3xl p-6 border border-slate-200/80 hover:border-red-300 transition-all hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black font-mono text-red-600/60 group-hover:text-red-600 transition-colors">
                      {stepItem.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-red-100/80 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{stepItem.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{stepItem.description}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200/60 flex items-center text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                  <span>Step {idx + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          {activeWorkflow === 'donor' ? (
            <button
              onClick={() => setActiveTab('register-donor')}
              className="px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Register as a Volunteer Donor Now</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('request-blood')}
              className="px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Hospital className="w-4 h-4" />
              <span>Submit Blood Request</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
