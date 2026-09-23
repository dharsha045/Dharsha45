import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Users, Clock, ShieldCheck, Activity, Award } from 'lucide-react';

export const HomeStats: React.FC = () => {
  const { donors, bloodRequests, totalLivesSaved } = useApp();

  const totalDonors = donors.length;
  const activeAvailableCount = donors.filter((d) => d.isAvailable).length;
  const openRequestsCount = bloodRequests.filter((r) => r.status === 'Open').length;
  const fulfilledCount = bloodRequests.filter((r) => r.status === 'Fulfilled').length;
  const totalRequestsCount = bloodRequests.length;
  const fulfillmentPercentage =
    totalRequestsCount > 0 ? Math.round((fulfilledCount / totalRequestsCount) * 100) : 100;

  const stats = [
    {
      label: 'Total Lives Saved',
      value: totalLivesSaved.toLocaleString(),
      subtext: totalLivesSaved === 0 ? 'Ready to record verified donations' : 'Verified transfusions & surgeries',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Active Donors (India)',
      value: totalDonors.toLocaleString(),
      subtext: totalDonors === 0 ? 'Be the first registered life-saver' : `${activeAvailableCount} ready for dispatch`,
      icon: Users,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      label: 'Open Blood Requests',
      value: openRequestsCount.toLocaleString(),
      subtext: openRequestsCount === 0 ? 'No pending urgent shortages' : 'Awaiting donor responses',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Emergency Fulfillment',
      value: `${fulfillmentPercentage}%`,
      subtext: 'Direct volunteer response rate',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 hover:border-red-200 transition-all hover:shadow-md group shadow-xs"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${stat.bgColor} ${stat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif] tabular-nums">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">{stat.label}</p>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
