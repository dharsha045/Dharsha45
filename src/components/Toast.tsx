import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, Siren } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all ${
              toast.type === 'emergency'
                ? 'bg-red-600 text-white border-red-700 shadow-red-500/30 ring-2 ring-red-400/50 animate-pulse'
                : toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700 shadow-emerald-500/20'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-700 shadow-amber-500/20'
                : toast.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-700 shadow-rose-500/20'
                : 'bg-slate-900/90 text-white border-slate-700 shadow-slate-900/30'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'emergency' && <Siren className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
