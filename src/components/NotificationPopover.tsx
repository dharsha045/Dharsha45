import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Siren, CheckCircle2, Info, Clock, CheckCheck, Trash2, X } from 'lucide-react';

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
  } = useApp();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-red-400" />
          <span className="font-bold text-sm">Notifications & Alerts</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-semibold">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Read all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
            No new notifications or emergency alerts at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                !n.read ? 'bg-rose-50/40' : ''
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {n.type === 'emergency' ? (
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Siren className="w-4 h-4 animate-pulse" />
                  </div>
                ) : n.type === 'match' ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs font-semibold truncate ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
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
      {notifications.length > 0 && (
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={clearNotifications}
            className="text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
          <span className="text-slate-400 text-[11px]">Click item to open action</span>
        </div>
      )}
    </div>
  );
};
