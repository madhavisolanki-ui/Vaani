import { useState } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserAvatarDropdown from "../components/UserAvatarDropdown";

export default function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const role = localStorage.getItem("role");
  if (role !== "teacher") return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* 1. Sidebar Component with 12 Features */}
      <Sidebar
        role="teacher"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-[#1E56A0] border-b border-[#164580] px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm z-20 text-white">
          {/* Left: ☰ Hamburger Button + Brand Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black transition active:scale-95 border border-white/20 flex items-center gap-2 cursor-pointer shadow-2xs"
              title="मेनू खोलें"
              aria-label="मेनू खोलें"
            >
              <span className="text-xl leading-none">☰</span>
              <span className="hidden sm:inline text-xs font-bold text-blue-100">मेनू</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="bg-white/15 text-white px-3 py-1 rounded-xl text-xs font-black border border-white/20 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>वाणीसेतु</span>
              </div>
              <div className="hidden lg:block text-xs text-blue-100 font-medium">
                झारखण्ड पलाश एम.टी.बी - एम.एल.ई पेडागॉजी पोर्टल
              </div>
            </div>
          </div>

          {/* Right: 🔔 Notifications Icon + NIPUN Badge + 👤 Profile Chip */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* NIPUN Mission Status Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#10B981]/25 text-emerald-200 text-xs font-black px-3 py-1.5 rounded-xl border border-[#10B981]/40">
              🇮🇳 निपुण भारत मिशन
            </span>

            {/* 🔔 Notification Icon Button */}
            <Link
              to="/teacher/notifications"
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 border border-white/15 flex items-center justify-center text-sm"
              title="सूचनाएं एवं सरकारी निर्देश देखें"
            >
              <span>🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D97706] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                2
              </span>
            </Link>

            {/* 👤 Profile Chip (UserAvatarDropdown) */}
            <UserAvatarDropdown role="teacher" />
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}