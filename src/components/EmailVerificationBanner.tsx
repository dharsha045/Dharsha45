import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

export const EmailVerificationBanner: React.FC = () => {
  const { authUser, isEmailVerified, resendVerificationEmail, checkEmailVerified, openAuthModal } = useApp();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  if (!authUser) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900">LifeLink Account Required</p>
            <p className="text-slate-600 mt-0.5">
              Please sign in or create an account with a verified email to access voluntary donor registration and emergency request features.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-xs transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // If email is verified or user authenticated via Google, no banner needed
  if (isEmailVerified || authUser.loginProvider === 'google') {
    return null;
  }

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    await resendVerificationEmail();
    setResending(false);
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCheck = async () => {
    setChecking(true);
    await checkEmailVerified();
    setChecking(false);
  };

  return (
    <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 mb-6 shadow-xs animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-900">
            Please verify your email before continuing.
          </p>
          <p className="text-slate-700 mt-0.5">
            A confirmation link was sent to <span className="font-bold text-slate-900">{authUser.email}</span>. To protect our donor network, access to donor and request features is paused until your email is verified.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
        <button
          type="button"
          onClick={handleCheck}
          disabled={checking}
          className="flex-1 sm:flex-initial px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          <span>{checking ? 'Checking...' : 'I Have Verified'}</span>
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="flex-1 sm:flex-initial px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
          <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}</span>
        </button>
      </div>
    </div>
  );
};
