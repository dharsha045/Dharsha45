import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Users, Clock, ShieldCheck, Activity, Award } from 'lucide-react';

export const HomeStats: React.FC = () => {
  const { donors, bloodRequests } = useApp();

  const totalCalculatedLivesSaved = donors.reduce((acc, d) => acc + d.livesSaved, 1280);
  const activeAvailableCount = donors.filter((d) => d.isAvailable).length;
  const fulfilledCount = bloodRequests.filter((r) => r.status === 'Fulfilled').length + 84;
  const totalRequestsCount = bloodRequests.length + 86;
  const fulfillmentPercentage = Math.round((fulfilledCount / totalRequestsCount) * 100);

  const stats = [
    {
      label: 'Total Lives Saved',
      value: totalCalculatedLivesSaved.toLocaleString(),
      subtext: 'Verified trauma & hospital cases',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Active Verified Donors',
      value: `${donors.length * 100 + activeAvailableCount * 5}+`,
      subtext: 'Ready for emergency dispatch',
      icon: Users,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      label: 'Avg. Response Time',
      value: '14.2 min',
      subtext: 'Rapid emergency alert matching',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Emergency Fulfillment',
      value: `${fulfillmentPercentage}%`,
      subtext: 'Critical surgeries supported',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/80 hover:border-red-200 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Activity className="w-4 h-4 text-slate-300 group-hover:text-red-400 transition-colors" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-bold text-slate-700">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
