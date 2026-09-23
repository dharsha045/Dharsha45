import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Droplet,
  Heart,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { auth } from '../services/firebase';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    completeGoogleProfile,
    resendVerificationEmail,
    checkEmailVerified,
    showToast,
    setActiveTab,
  } = useApp();

  // Internal view steps:
  // 'auth': standard login / signup view
  // 'verification_pending': show email verification screen
  // 'google_complete_profile': show missing LifeLink fields for new Google user
  const [viewStep, setViewStep] = useState<'auth' | 'verification_pending' | 'google_complete_profile'>('auth');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [selectedState, setSelectedState] = useState('');
  const [district, setDistrict] = useState('');

  // UI status states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const isSignup = authModalMode === 'signup';

  // Sync / Reset on modal open or mode change
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      if (viewStep !== 'google_complete_profile') {
        setViewStep('auth');
      }
    }
  }, [isAuthModalOpen, authModalMode]);

  // Handle resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  // Handle Email + Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    const res = await loginWithEmail(cleanEmail, password);
    setLoading(false);

    if (res.success) {
      closeAuthModal();
      setActiveTab('home');
    } else if (res.emailVerificationPending) {
      setPendingVerificationEmail(cleanEmail);
      setViewStep('verification_pending');
      setErrorMsg('Please verify your email before continuing.');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  // Handle Email + Password Signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanDigits = phoneDigits.replace(/\D/g, '');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (cleanDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number (+91).');
      return;
    }
    if (!selectedState) {
      setErrorMsg('Please select your State / Union Territory.');
      return;
    }
    if (!district) {
      setErrorMsg('Please select your District.');
      return;
    }

    setLoading(true);
    const res = await signupWithEmail({
      name: fullName.trim(),
      email: cleanEmail,
      password,
      phone: `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`,
      bloodGroup,
      state: selectedState,
      district,
    });
    setLoading(false);

    if (res.success && res.emailVerificationPending) {
      setPendingVerificationEmail(cleanEmail);
      setViewStep('verification_pending');
      setSuccessMsg(`Verification email sent to ${cleanEmail}. Please verify before continuing.`);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  // Handle Continue with Google
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGoogleLoading(true);

    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      if (res.profileComplete) {
        closeAuthModal();
        setActiveTab('home');
      } else {
        // Need to collect missing LifeLink information
        setViewStep('google_complete_profile');
      }
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  // Handle Completing Missing Profile Details for Google User
  const handleCompleteGoogleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanDigits = phoneDigits.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number (+91).');
      return;
    }
    if (!selectedState) {
      setErrorMsg('Please select your State / Union Territory.');
      return;
    }
    if (!district) {
      setErrorMsg('Please select your District.');
      return;
    }

    setLoading(true);
    const res = await completeGoogleProfile({
      phone: `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`,
      bloodGroup,
      state: selectedState,
      district,
    });
    setLoading(false);

    if (res.success) {
      closeAuthModal();
      setActiveTab('home');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  // Handle Resend Verification Email
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg('');
    setLoading(true);
    const res = await resendVerificationEmail();
    setLoading(false);
    if (res.success) {
      setSuccessMsg('A new verification email has been sent! Please check your inbox and spam folder.');
      setResendCooldown(60);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  // Handle "I Have Verified My Email"
  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    setErrorMsg('');
    const verified = await checkEmailVerified();
    setCheckingVerification(false);

    if (verified) {
      closeAuthModal();
      setActiveTab('home');
    } else {
      setErrorMsg('Email is not yet verified. Please click the verification link sent to your email, then click this button again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/15 hover:bg-black/30 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Heart className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-['Outfit',sans-serif]">
                {viewStep === 'verification_pending'
                  ? 'Verify Your Email'
                  : viewStep === 'google_complete_profile'
                  ? 'Complete Your Profile'
                  : isSignup
                  ? 'Join LifeLink Network'
                  : 'Welcome to LifeLink'}
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                {viewStep === 'verification_pending'
                  ? 'Please verify your email before continuing'
                  : viewStep === 'google_complete_profile'
                  ? 'Save your location & blood group to enable donor matching'
                  : isSignup
                  ? 'Sign up to donate blood or request emergency transfusions'
                  : 'Sign in to access your donor dashboard'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs (Only in standard auth mode) */}
          {viewStep === 'auth' && (
            <div className="flex bg-black/20 p-1 rounded-xl mt-5 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  openAuthModal('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isSignup ? 'bg-white text-red-700 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  openAuthModal('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isSignup ? 'bg-white text-red-700 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="space-y-1">
                <span>{errorMsg}</span>
                {errorMsg.includes('already exists') && isSignup && (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        openAuthModal('login');
                        setErrorMsg('');
                      }}
                      className="text-red-700 font-bold underline hover:text-red-800 cursor-pointer text-[11px]"
                    >
                      Click here to Sign In instead
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Notice */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 1: EMAIL VERIFICATION PENDING SCREEN                     */}
          {/* ───────────────────────────────────────────────────────────── */}
          {viewStep === 'verification_pending' && (
            <div className="text-center py-3 space-y-4">
              <div className="w-16 h-16 bg-amber-50 border-2 border-amber-200 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-slate-900">
                  Please verify your email before continuing.
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  A verification link has been sent to{' '}
                  <span className="font-bold text-slate-900">
                    {pendingVerificationEmail || auth.currentUser?.email || 'your email'}
                  </span>
                  . Please check your inbox and click the link to activate your LifeLink account.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>Why verify?</span>
                </div>
                <p>
                  To protect our voluntary donor directory and patient requests against spam, access to donor and request features requires a verified email address.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckVerification}
                  disabled={checkingVerification}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  {checkingVerification ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking Status...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>I Have Verified My Email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading || resendCooldown > 0}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0
                      ? `Resend available in ${resendCooldown}s`
                      : 'Resend Verification Email'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewStep('auth');
                    openAuthModal('login');
                    setErrorMsg('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold pt-2 inline-block cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 2: COMPLETE GOOGLE PROFILE (NEW GOOGLE USER)            */}
          {/* ───────────────────────────────────────────────────────────── */}
          {viewStep === 'google_complete_profile' && (
            <form onSubmit={handleCompleteGoogleProfileSubmit} className="space-y-4">
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-center gap-3">
                {auth.currentUser?.photoURL ? (
                  <img
                    src={auth.currentUser.photoURL}
                    alt={auth.currentUser.displayName || 'Google Avatar'}
                    className="w-10 h-10 rounded-full border border-rose-200 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center font-bold text-rose-800">
                    {auth.currentUser?.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {auth.currentUser?.displayName || 'LifeLink Donor'}
                  </p>
                  <p className="text-[11px] text-slate-600 truncate">{auth.currentUser?.email}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                Please complete your donor location details. No password is required for Google users.
              </p>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 border-r border-slate-300 pr-2">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-20 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        bloodGroup === bg
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* State & District Dependent Dropdowns */}
              <LocationSelector
                selectedState={selectedState}
                selectedDistrict={district}
                onStateChange={(st) => {
                  setSelectedState(st);
                  setDistrict('');
                }}
                onDistrictChange={(dt) => setDistrict(dt)}
                stateRequired
                districtRequired
                isCompact
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Profile & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 3: REGULAR LOGIN & SIGNUP VIEWS                          */}
          {/* ───────────────────────────────────────────────────────────── */}
          {viewStep === 'auth' && (
            <div className="space-y-4">
              {/* Form (Login vs Signup) */}
              <form
                onSubmit={isSignup ? handleEmailSignup : handleEmailLogin}
                className="space-y-3.5"
              >
                {/* Full Name (Signup only) */}
                {isSignup && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Verma"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    {isSignup && (
                      <span className="text-[10px] text-slate-400">Min 6 characters</span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Additional LifeLink Registration fields (Signup only) */}
                {isSignup && (
                  <>
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 border-r border-slate-300 pr-2">
                          <span>🇮🇳 +91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phoneDigits}
                          onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
                          placeholder="98765 43210"
                          className="w-full pl-20 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden font-medium"
                        />
                      </div>
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Blood Group <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {BLOOD_GROUPS.map((bg) => (
                          <button
                            key={bg}
                            type="button"
                            onClick={() => setBloodGroup(bg)}
                            className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              bloodGroup === bg
                                ? 'bg-red-600 text-white border-red-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {bg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* State & District Dependent Dropdowns */}
                    <LocationSelector
                      selectedState={selectedState}
                      selectedDistrict={district}
                      onStateChange={(st) => {
                        setSelectedState(st);
                        setDistrict('');
                      }}
                      onDistrictChange={(dt) => setDistrict(dt)}
                      stateRequired
                      districtRequired
                      isCompact
                    />
                  </>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-1"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isSignup ? 'Creating Account...' : 'Signing In...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* ──────── OR ──────── */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  OR
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Continue with Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-4 h-4" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Switch link */}
              <div className="text-center pt-2">
                {isSignup ? (
                  <p className="text-xs text-slate-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        openAuthModal('login');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        openAuthModal('signup');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Security & Confidentiality Tag */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured with Firebase Authentication & Cloud Firestore</span>
          </div>
        </div>
      </div>
    </div>
  );
};
