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
  ChevronDown
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
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-red-600 bg-red-50/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  } ${item.emergency && criticalOpenCount > 0 ? 'text-red-600 font-bold' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-500'} ${item.emergency && criticalOpenCount > 0 ? 'text-red-600 animate-pulse' : ''}`} />
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/30"
            >
              <Droplet className="w-3.5 h-3.5 fill-white" />
              <span>Request Blood</span>
            </button>

            {/* Donor / Admin Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left"
              >
                {currentDonor ? (
                  <>
                    <img
                      src={currentDonor.avatar}
                      alt={currentDonor.name}
                      className="w-7 h-7 rounded-lg object-cover border border-red-200"
                    />
                    <div className="hidden sm:block">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                          {currentDonor.name.split(' ')[0]}
                        </span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-red-100 text-red-700 font-extrabold">
                          {currentDonor.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Guest</span>
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Active Session</p>
                    {currentDonor ? (
                      <div className="mt-1">
                        <p className="text-sm font-bold text-slate-900">{currentDonor.name}</p>
                        <p className="text-xs text-slate-500">{currentDonor.email}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                            {currentDonor.bloodGroup} Donor
                          </span>
                          <span className={`text-[11px] ${currentDonor.isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {currentDonor.isAvailable ? '● Available' : '○ Unavailable'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 mt-1">Select a demo donor to test active donor dashboard</p>
                    )}
                  </div>

                  {/* Switch Demo Donors */}
                  <div className="px-2 py-1.5 max-h-48 overflow-y-auto">
                    <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Switch Demo Persona
                    </p>
                    {donors.slice(0, 4).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setCurrentDonor(d);
                          setUserMenuOpen(false);
                          setActiveTab('donor-dashboard');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentDonor?.id === d.id ? 'bg-rose-50 text-red-700 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{d.name}</span>
                        <span className="font-mono text-[10px] px-1 rounded bg-slate-100 text-slate-600 font-bold">
                          {d.bloodGroup}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-1 px-2">
                    <button
                      onClick={() => {
                        setActiveTab('admin-dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-600" />
                      Hospital Admin Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Admin / Hospital Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
