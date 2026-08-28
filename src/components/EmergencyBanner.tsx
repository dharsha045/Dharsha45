import React from 'react';
import { useApp } from '../context/AppContext';
import { Siren, ChevronRight, Zap } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { bloodRequests, setActiveTab, setActiveRespondRequest } = useApp();

  const criticalRequests = bloodRequests.filter(
    (r) => r.emergencyLevel === 'Critical' && r.status === 'Open'
  );

  if (criticalRequests.length === 0) return null;

  const topCritical = criticalRequests[0];

  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white px-4 py-2.5 shadow-md relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>

          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider bg-red-900/60 px-2 py-0.5 rounded text-[11px] shrink-0">
            <Siren className="w-3.5 h-3.5" />
            Active Critical Alert
          </div>

          <p className="font-medium text-white">
            <strong className="text-rose-100">{topCritical.requiredBloodGroup}</strong> blood urgently required for {topCritical.patientName} at {topCritical.hospitalName}, {topCritical.city}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveRespondRequest(topCritical)}
            className="px-3 py-1 bg-white text-red-700 font-bold rounded-lg hover:bg-rose-50 transition-colors shadow-xs flex items-center gap-1 text-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-red-600" />
            Respond Now
          </button>
          
          <button
            onClick={() => setActiveTab('emergency-alerts')}
            className="px-2.5 py-1 bg-red-800/60 hover:bg-red-800 text-rose-100 rounded-lg transition-colors flex items-center gap-1 text-xs"
          >
            View All ({criticalRequests.length})
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
