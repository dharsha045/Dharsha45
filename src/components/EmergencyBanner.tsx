import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Siren, ChevronRight, Zap, Volume2, VolumeX, ChevronLeft, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EmergencyBanner: React.FC = () => {
  const {
    bloodRequests,
    setActiveTab,
    setActiveRespondRequest,
    isSoundEnabled,
    toggleSound,
  } = useApp();

  const criticalRequests = bloodRequests.filter(
    (r) => (r.emergencyLevel === 'Critical' || r.emergencyLevel === 'Urgent') && r.status === 'Open'
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-cycle through active urgent requests if there are multiple
  useEffect(() => {
    if (criticalRequests.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % criticalRequests.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [criticalRequests.length]);

  if (criticalRequests.length === 0) {
    return (
      <div className="bg-slate-900 text-slate-300 px-4 py-2 border-b border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-semibold text-white">Emergency Blood Network Active</span>
            <span className="hidden sm:inline text-slate-400">· All emergency blood requests are currently fulfilled</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('request-blood')}
              className="px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle className="w-3 h-3" />
              Post Blood Request (+91)
            </button>
            <button
              onClick={toggleSound}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title={isSoundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
            >
              {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentReq = criticalRequests[currentIndex % criticalRequests.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % criticalRequests.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + criticalRequests.length) % criticalRequests.length);
  };

  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white px-4 py-2.5 shadow-md relative z-30 border-b border-red-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
        
        {/* Left Side: Indicator & Urgent Blood Request Details */}
        <div className="flex items-center gap-2.5 w-full md:w-auto min-w-0">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>

          <div className="flex items-center gap-1.5 font-extrabold uppercase tracking-wider bg-red-950/70 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] shrink-0 border border-red-400/30">
            <Siren className="w-3.5 h-3.5 text-red-300 animate-pulse" />
            <span>Urgent Blood Request</span>
            {criticalRequests.length > 1 && (
              <span className="bg-red-800 px-1.5 py-0.2 rounded text-[9px] ml-0.5">
                {currentIndex + 1}/{criticalRequests.length}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReq.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 truncate"
              >
                <span className="px-2 py-0.5 bg-white text-red-700 font-extrabold rounded-md text-xs shrink-0 shadow-xs">
                  {currentReq.requiredBloodGroup}
                </span>
                <p className="font-medium text-white truncate text-xs sm:text-sm">
                  <strong>{currentReq.unitsNeeded} unit(s)</strong> urgently required for{' '}
                  <span className="text-rose-100 font-semibold">{currentReq.patientName}</span> at{' '}
                  <span className="underline decoration-rose-300/60 underline-offset-2">{currentReq.hospitalName}</span>, {currentReq.city}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Action Buttons & Controls */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          {criticalRequests.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-red-800/60 rounded-lg p-0.5">
              <button
                onClick={handlePrev}
                className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                title="Previous request"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                title="Next request"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => setActiveRespondRequest(currentReq)}
            className="px-3.5 py-1.5 bg-white text-red-700 font-bold rounded-xl hover:bg-rose-50 transition-all shadow-sm flex items-center gap-1.5 text-xs active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-red-600 text-red-600" />
            I Can Donate
          </button>
          
          <button
            onClick={() => setActiveTab('emergency-alerts')}
            className="px-2.5 py-1.5 bg-red-900/60 hover:bg-red-900/90 text-rose-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            All Requests ({criticalRequests.length})
            <ChevronRight className="w-3 h-3" />
          </button>

          {/* Sound Mute/Unmute */}
          <div className="flex items-center border-l border-red-500/40 pl-2 ml-1">
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg transition-colors ${
                isSoundEnabled ? 'bg-red-800/80 text-white hover:bg-red-800' : 'bg-red-950/40 text-red-300 hover:text-white'
              }`}
              title={isSoundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
            >
              {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-rose-200" /> : <VolumeX className="w-3.5 h-3.5 text-rose-300" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
