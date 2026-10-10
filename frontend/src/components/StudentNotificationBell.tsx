import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  type StudentNotification,
  getStudentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/studentNotificationService";

export default function StudentNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifs();
    const handleUpdate = () => loadNotifs();
    window.addEventListener("student_notifications_updated", handleUpdate);
    return () => {
      window.removeEventListener("student_notifications_updated", handleUpdate);
    };
  }, []);

  const loadNotifs = () => {
    setNotifications(getStudentNotifications());
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleItemClick = (notif: StudentNotification) => {
    markNotificationAsRead(notif.id);
    setIsOpen(false);
    navigate(notif.ctaLink);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    loadNotifs();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Floating Bell Button with Red Badge Counter */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition active:scale-95 border border-white/20 flex items-center justify-center cursor-pointer shadow-2xs"
        title="सूचनाएं (Notifications)"
        aria-label="सूचनाएं"
      >
        <span className="text-xl leading-none">🔔</span>

        {/* Dynamic Red Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-[#1E56A0] shadow-md animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notification Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#C7D2FE] z-50 overflow-hidden animate-in fade-in zoom-in-95 font-sans">
          {/* Header */}
          <div className="bg-[#EEF2FF] p-4 border-b border-[#C7D2FE] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <h3 className="text-sm font-black text-slate-900">
                रियल-टाइम अपडेट्स
              </h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount} नई
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-black text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
              >
                सभी पढ़ें ✓
              </button>
            )}
          </div>

          {/* List of Latest Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-1">
            {notifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-3.5 hover:bg-blue-50/70 transition cursor-pointer rounded-xl flex items-start gap-3 ${
                  !notif.isRead ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                  {notif.icon}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-slate-700 border border-[#C7D2FE]">
                      {notif.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 leading-snug truncate">
                    {notif.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {notif.description}
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-[11px] font-black text-blue-700">
                    <span>{notif.ctaText}</span>
                    <span>➔</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer View All Link */}
          <div className="bg-[#F8FAFC] p-3 text-center border-t border-slate-100">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-black text-blue-700 hover:text-blue-900 transition flex items-center justify-center gap-1"
            >
              <span>सभी सूचनाएं विस्तार से देखें</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
