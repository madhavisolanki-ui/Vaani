import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserAvatarDropdown from "../components/UserAvatarDropdown";
import StudentNotificationBell from "../components/StudentNotificationBell";

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const role = localStorage.getItem("role");
  if (role !== "student") return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar Drawer */}
      <Sidebar
        role="student"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-[#1E56A0] border-b border-[#164580] px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm z-20 text-white">
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
            <div className="bg-white/15 text-white px-3 py-1 rounded-lg text-xs font-black border border-white/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              विद्यार्थी कक्ष 
            </div>
            <div className="hidden md:block text-xs text-blue-100 font-medium">
              मातृभाषा-आधारित बहुभाषी शिक्षण मंच
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StudentNotificationBell />
            <UserAvatarDropdown role="student" />
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