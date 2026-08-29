import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import {
  X,
  Phone,
  Mail,
  Lock,
  User,
  MapPin,
  Heart,
  Droplet,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  AlertCircle
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const INDIAN_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Kochi'
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    loginWithEmail,
    loginWithMobile,
    signupUser,
    showToast,
  } = useApp();

  // Mode: 'login' | 'signup'
  const isSignup = authModalMode === 'signup';

  // Method: 'mobile' | 'email'
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');

  // Form states
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('Mumbai');
  const [asDonor, setAsDonor] = useState(true);

  // OTP simulation for mobile
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp] = useState('9482');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = () => {
    const clean = mobileNumber.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      showToast('info', 'OTP Sent', `Simulated SMS OTP sent to +91 ${clean.slice(-10)}. Code is: ${simulatedOtp}`);
    }, 600);
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpSent) {
      handleSendOtp();
      return;
    }

    if (otpCode.trim() !== simulatedOtp && otpCode.trim().length !== 4) {
      setErrorMsg(`Invalid verification code. Enter the 4-digit code (e.g. ${simulatedOtp}).`);
      return;
    }

    setLoading(true);
    if (isSignup) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        setLoading(false);
        return;
      }
      await signupUser({
        name: fullName.trim(),
        authMethod: 'mobile',
        mobile: `+91 ${mobileNumber.replace(/[^0-9]/g, '').slice(-10)}`,
        bloodGroup,
        city,
        asDonor,
      });
    } else {
      await loginWithMobile(mobileNumber, otpCode);
    }
    setLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailAddress.includes('@') || !emailAddress.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    if (isSignup) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        setLoading(false);
        return;
      }
      await signupUser({
        name: fullName.trim(),
        authMethod: 'email',
        email: emailAddress.trim().toLowerCase(),
        bloodGroup,
        city,
        asDonor,
      });
    } else {
      await loginWithEmail(emailAddress, password);
    }
    setLoading(false);
  };

  const handleQuickDemoLogin = (type: 'donor' | 'requester') => {
    if (type === 'donor') {
      loginWithMobile('9820144521');
    } else {
      loginWithEmail('emergency.delhi@apollo.hospital.in');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/15 hover:bg-black/30 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Heart className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-['Outfit',sans-serif]">
                {isSignup ? 'Create LifeLink Account' : 'Welcome to LifeLink'}
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                {isSignup
                  ? 'Join India’s verified blood donor & emergency response network'
                  : 'Sign in with Mobile (+91) or Email'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-5 border border-white/10">
            <button
              onClick={() => {
                openAuthModal('login');
                setErrorMsg('');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isSignup ? 'bg-white text-red-700 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                openAuthModal('signup');
                setErrorMsg('');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isSignup ? 'bg-white text-red-700 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              New Registration
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Method Switcher: Mobile or Email */}
          <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMethod('mobile');
                setErrorMsg('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                method === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>Mobile Number (+91)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('email');
                setErrorMsg('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                method === 'email'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-red-600" />
              <span>Email Address</span>
            </button>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* MOBILE FORM */}
          {method === 'mobile' ? (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Indian Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 border-r border-slate-300 pr-2">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-20 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Used exclusively for critical emergency hospital SMS alerts.
                </p>
              </div>

              {otpSent && (
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-red-600" />
                      Enter 4-Digit OTP Code:
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpCode(simulatedOtp)}
                      className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Auto-fill ({simulatedOtp})
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="• • • •"
                    className="w-full text-center tracking-widest text-lg font-bold font-mono py-2 bg-white border border-rose-300 rounded-xl text-slate-900 focus:border-red-500 outline-hidden"
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Didn't receive SMS?</span>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Registration details */}
              {isSignup && (
                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:border-red-500 outline-hidden"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:border-red-500 outline-hidden"
                      >
                        {INDIAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={asDonor}
                      onChange={(e) => setAsDonor(e.target.checked)}
                      className="mt-0.5 rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-900 block">
                        Enroll as Voluntary Donor
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Allow verified hospitals in {city} to request emergency blood when matched.
                      </span>
                    </div>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying...</span>
                ) : !otpSent ? (
                  <>
                    <span>Get Verification Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : isSignup ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Registration</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* EMAIL FORM */
            <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                      placeholder="e.g. Ananya Sen"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 outline-hidden font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password {isSignup && <span className="text-slate-400">(Optional for demo)</span>}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              {isSignup && (
                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:border-red-500 outline-hidden"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:border-red-500 outline-hidden"
                      >
                        {INDIAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={asDonor}
                      onChange={(e) => setAsDonor(e.target.checked)}
                      className="mt-0.5 rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-900 block">
                        Enroll as Voluntary Donor
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Receive instant notifications when hospital patients near you need blood.
                      </span>
                    </div>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : isSignup ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Registration</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In with Email</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Accounts */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Or Instant Demo Sign-In
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('donor')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-red-300 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Droplet className="w-3 h-3 text-red-600 fill-red-600" />
                  <span className="text-xs font-bold text-slate-800 truncate">Aarav (Donor)</span>
                </div>
                <p className="text-[10px] text-slate-400">O+ • Mumbai</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('requester')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-red-300 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-slate-700" />
                  <span className="text-xs font-bold text-slate-800 truncate">Hospital Admin</span>
                </div>
                <p className="text-[10px] text-slate-400">Apollo Hospital</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
