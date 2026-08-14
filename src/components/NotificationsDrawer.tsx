import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Package, 
  Zap, 
  Award, 
  Palette, 
  ChevronRight,
  Clock,
  Filter
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { AppNotification } from '../types';

export const NotificationsDrawer: React.FC = () => {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    setActiveTab
  } = useShop();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order' | 'deal'>('all');

  if (!isNotificationsOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'order') return n.type === 'order';
    if (activeFilter === 'deal') return n.type === 'deal';
    return true;
  });

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'deal':
        return <Zap className="w-4 h-4 text-[#d94636]" />;
      case 'points':
        return <Award className="w-4 h-4 text-[#f09a8e]" />;
      case 'system':
      default:
        return <Palette className="w-4 h-4 text-purple-500" />;
    }
  };

  const getBgForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return 'bg-emerald-50 border-emerald-200';
      case 'deal':
        return 'bg-red-50 border-red-200';
      case 'points':
        return 'bg-[#fcf5f3] border-[#f09a8e]/30';
      case 'system':
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
      setIsNotificationsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={() => setIsNotificationsOpen(false)} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#ebdcd8] rounded-l-3xl overflow-hidden">
          
          {/* Header */}
          <div className="p-5 bg-[#2c2221] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl relative">
                <Bell className="w-5 h-5 text-[#f8d0c8]" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#f09a8e] rounded-full border-2 border-[#2c2221]" />
                )}
              </div>
              <div>
                <h2 className="font-bold font-serif text-base text-white flex items-center gap-2">
                  Notifications
                  {unreadNotificationsCount > 0 && (
                    <span className="bg-[#f09a8e] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {unreadNotificationsCount} New
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-[#d6beba]">Order alerts, flash deals & student reward points</p>
              </div>
            </div>

            <button 
              onClick={() => setIsNotificationsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar & Quick Filters */}
          <div className="p-3 bg-[#faf5f4] border-b border-[#ebdcd8] flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {(['all', 'unread', 'order', 'deal'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize transition ${
                    activeFilter === filter
                      ? 'bg-[#2c2221] text-white shadow-xs'
                      : 'bg-white text-[#735853] hover:bg-[#f0e4e1] border border-[#ebdcd8]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="p-1.5 text-xs text-[#2c2221] hover:text-[#f09a8e] font-semibold flex items-center gap-1 transition"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-1.5 text-xs text-red-500 hover:text-red-700 transition"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fdfcfc]">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center space-y-3 px-4">
                <div className="w-14 h-14 bg-[#faf5f4] text-gray-400 rounded-full flex items-center justify-center mx-auto border border-[#ebdcd8]">
                  <Bell className="w-6 h-6 text-[#f09a8e]" />
                </div>
                <h3 className="font-bold text-sm text-[#2c2221]">No notifications here</h3>
                <p className="text-xs text-[#735853] max-w-xs mx-auto">
                  {activeFilter === 'unread' 
                    ? "You're all caught up! No unread notifications right now."
                    : "Order status updates, flash deals, and student rewards will appear here."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 relative group ${
                    notif.read 
                      ? 'bg-white border-[#ebdcd8] opacity-85 hover:opacity-100 hover:border-[#2c2221]' 
                      : 'bg-white border-[#f09a8e] shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Unread Pill Indicator */}
                  {!notif.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#f09a8e] animate-pulse" />
                  )}

                  {/* Type Icon Badge */}
                  <div className={`p-2.5 rounded-xl border shrink-0 ${getBgForType(notif.type)}`}>
                    {getIconForType(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-[#2c2221] truncate">{notif.title}</h4>
                    </div>
                    <p className="text-xs text-[#594744] mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>
                      {notif.linkTab && (
                        <span className="text-[10px] font-bold text-[#f09a8e] group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                          <span>View Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Info Banner */}
          <div className="p-4 bg-[#faf5f4] border-t border-[#ebdcd8] text-center text-xs text-[#735853] flex items-center justify-between">
            <span className="text-[11px] font-medium">Real-time Paystack & hostel delivery notifications</span>
            <button
              onClick={() => {
                setActiveTab('account');
                setIsNotificationsOpen(false);
              }}
              className="text-[11px] font-bold text-[#2c2221] hover:underline"
            >
              Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
