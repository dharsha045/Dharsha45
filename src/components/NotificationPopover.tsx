import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Siren, CheckCircle2, Info, Clock, CheckCheck, Trash2, X, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setActiveTab,
    setActiveRespondRequest,
    bloodRequests,
    isSoundEnabled,
    toggleSound,
    simulateIncomingEmergency,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'system'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter((n) => n.type === 'emergency' && !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'emergency') return n.type === 'emergency';
    if (activeFilter === 'system') return n.type !== 'emergency';
    return true;
  });

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.tabTarget) {
      setActiveTab(notif.tabTarget);
    }
    if (notif.requestId) {
      const matched = bloodRequests.find((r) => r.id === notif.requestId);
      if (matched) {
        setActiveRespondRequest(matched);
      }
    }
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600/30 text-red-400 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">Live Alert Dispatch</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">Real-time emergency updates</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg transition-colors ${
              isSoundEnabled ? 'text-rose-300 hover:bg-white/10' : 'text-slate-500 hover:bg-white/10'
            }`}
            title={isSoundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Test trigger */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('emergency')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors ${
              activeFilter === 'emergency'
                ? 'bg-red-600 text-white'
                : 'text-red-700 bg-red-50 hover:bg-red-100'
            }`}
          >
            <Siren className="w-3 h-3" />
            Urgent {urgentCount > 0 && `(${urgentCount})`}
          </button>
        </div>

        <button
          onClick={simulateIncomingEmergency}
          className="px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-colors"
          title="Simulate live emergency"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          Simulate
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
            No notifications in this filter view.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                !n.read ? 'bg-rose-50/40' : ''
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {n.type === 'emergency' ? (
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center border border-red-200">
                    <Siren className="w-4 h-4 animate-pulse" />
                  </div>
                ) : n.type === 'match' ? (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs truncate ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
              </div>

              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        {unreadCount > 0 ? (
          <button
            onClick={markAllNotificationsRead}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold text-[11px]"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        ) : (
          <button
            onClick={clearNotifications}
            className="text-slate-500 hover:text-red-600 flex items-center gap-1 text-[11px] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
        <span className="text-slate-400 text-[10px]">Tap alert to respond immediately</span>
      </div>
    </div>
  );
};
