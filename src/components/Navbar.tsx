import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import {
  Heart,
  Search,
  UserPlus,
  Droplet,
  Siren,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  Menu,
  X,
  Sparkles,
  Users,
  Compass,
  CheckCircle,
  HelpCircle,
  LogOut,
  ChevronDown,
  Smartphone,
  Download,
  Info,
  LogIn,
  UserCheck
} from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    notifications,
    currentDonor,
    donors,
    setCurrentDonor,
    isAdmin,
    setIsAdmin,
    bloodRequests,
    authUser,
    openAuthModal,
    logoutUser,
    openApkModal,
    downloadApkFile,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const criticalOpenCount = bloodRequests.filter(
    (r) => r.emergencyLevel === 'Critical' && r.status === 'Open'
  ).length;

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems: { tab: NavigationTab; label: string; icon: React.ElementType; badge?: number; emergency?: boolean }[] = [
    { tab: 'home', label: 'Home', icon: Compass },
    { tab: 'find-donor', label: 'Find a Donor', icon: Search },
    { tab: 'register-donor', label: 'Become a Donor', icon: UserPlus },
    { tab: 'request-blood', label: 'Request Blood', icon: Droplet },
    {
      tab: 'emergency-alerts',
      label: 'Emergency SOS',
      icon: Siren,
      badge: criticalOpenCount,
      emergency: true,
    },
    { tab: 'compatibility-guide', label: 'Compatibility', icon: Sparkles },
    { tab: 'eligibility-checker', label: 'Eligibility', icon: HelpCircle },
    { tab: 'donor-dashboard', label: 'Donor Hub', icon: LayoutDashboard },
    { tab: 'about', label: 'About & App', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white text-white" />
              <Droplet className="w-3.5 h-3.5 fill-rose-100 text-rose-100 absolute -bottom-0.5 -right-0.5 animate-bounce" style={{ animationDuration: '2.5s' }} />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                  Life<span className="text-red-600">Link</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                  Smart Blood Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block leading-tight">
                Emergency Donor Finder
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-red-600 bg-red-50/80 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  } ${item.emergency && criticalOpenCount > 0 ? 'text-red-600 font-bold' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-600' : 'text-slate-500'} ${item.emergency && criticalOpenCount > 0 ? 'text-red-600 animate-pulse' : ''}`} />
                  <span>{item.label}</span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-extrabold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* APK Download Button */}
            <button
              onClick={openApkModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer hover:scale-105 border border-slate-700"
              title="Download Android APK v2.4.0"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Get APK</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">
                v2.4
              </span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              <NotificationPopover isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            {/* Quick Request Blood Callout */}
            <button
              onClick={() => handleNavClick('request-blood')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/30 cursor-pointer"
            >
              <Droplet className="w-3.5 h-3.5 fill-white" />
              <span>Request Blood</span>
            </button>

            {/* Authentication / User Profile Button */}
            {authUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl border border-red-200 hover:border-red-300 bg-rose-50/50 hover:bg-rose-50 transition-all text-left cursor-pointer"
                >
                  <img
                    src={authUser.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`}
                    alt={authUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-red-200"
                  />
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[90px]">
                        {authUser.name.split(' ')[0]}
                      </span>
                      {authUser.bloodGroup && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-red-600 text-white font-extrabold">
                          {authUser.bloodGroup}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Active User Account</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          Verified
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2.5">
                        <img
                          src={authUser.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`}
                          alt={authUser.name}
                          className="w-10 h-10 rounded-xl object-cover border border-red-100"
                        />
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-900 truncate">{authUser.name}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {authUser.authMethod === 'mobile' ? authUser.mobile : authUser.email}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            {authUser.bloodGroup && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold">
                                {authUser.bloodGroup}
                              </span>
                            )}
                            {authUser.city && (
                              <span className="text-[10px] text-slate-500">
                                {authUser.city}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 py-1.5 space-y-0.5">
                      <button
                        onClick={() => {
                          setActiveTab('donor-dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-red-600" />
                        <span>My Donor Hub & Certificate</span>
                      </button>

                      <button
                        onClick={() => {
                          openApkModal();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>Download Android APK (v2.4)</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('admin-dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-600" />
                        <span>Hospital Admin Panel</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1.5 px-2">
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                >
                  <LogIn className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => openAuthModal('signup')}
                  className="hidden sm:flex px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-600" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl animate-fade-in">
          {/* Mobile Auth / Profile Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-2">
            {authUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={authUser.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`}
                    alt={authUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-red-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{authUser.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {authUser.authMethod === 'mobile' ? authUser.mobile : authUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login (Mobile/Email)</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Free</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick APK banner on mobile */}
          <div className="p-2.5 bg-gradient-to-r from-slate-900 to-red-950 text-white rounded-2xl flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold block">LifeLink Android App</span>
                <span className="text-[10px] text-slate-300">Download APK v2.4.0 (14.8 MB)</span>
              </div>
            </div>
            <button
              onClick={() => {
                downloadApkFile();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>APK</span>
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'text-red-600 bg-red-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Hospital & Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
