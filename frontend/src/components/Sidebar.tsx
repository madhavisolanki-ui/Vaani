import { NavLink, useLocation, useNavigate } from "react-router-dom";

type SidebarProps = {
  role: "teacher" | "student";
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ role, isOpen = false, onClose }: SidebarProps) {
  const base = `/${role}`;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    if (confirm("क्या आप सुरक्षित रूप से लॉगआउट करना चाहते हैं?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userSchool");
      localStorage.removeItem("userAddress");
      navigate("/login");
    }
  };

  // Helper function to check student active state accurately (Current Page Only)
  const isStudentItemActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        currentPath === "/dashboard" ||
        currentPath === "/student" ||
        currentPath === "/student/dashboard"
      );
    }
    if (href === "/live-class") {
      return (
        currentPath === "/live-class" ||
        currentPath === "/liveclass" ||
        currentPath === "/student/liveclass" ||
        currentPath === "/student/live-class"
      );
    }
    if (href === "/worksheets") {
      return currentPath === "/worksheets" || currentPath === "/student/worksheets";
    }
    if (href === "/quiz") {
      return currentPath === "/quiz" || currentPath === "/student/quiz";
    }
    if (href === "/flashcards") {
      return currentPath === "/flashcards" || currentPath === "/student/flashcards";
    }
    if (href === "/drawing-canvas") {
      return (
        currentPath === "/drawing-canvas" || currentPath === "/student/drawing-canvas"
      );
    }
    if (href === "/audio-library") {
      return (
        currentPath === "/audio-library" || currentPath === "/student/audio-library"
      );
    }
    if (href === "/profile") {
      return currentPath === "/profile" || currentPath === "/student/profile";
    }
    if (href === "/settings") {
      return currentPath === "/settings" || currentPath === "/student/settings";
    }
    return false;
  };

  return (
    <>
      {/* Backdrop Overlay when Sidebar is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 animate-in fade-in duration-200"
        />
      )}

      {/* Main Drawer Sidebar Element */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1E56A0] text-white border-r border-[#164580] h-screen flex flex-col justify-between py-5 shadow-2xl select-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Brand Header */}
          <div className="px-5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-[#1E56A0] rounded-xl flex items-center justify-center text-xl shadow-md font-black">
                🎓
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight leading-tight">
                  वाणी<span className="text-[#E05638]">सेतु</span>
                </h2>
                <span className="text-[10px] bg-white/15 text-blue-100 font-bold px-2 py-0.5 rounded-md border border-white/20 uppercase tracking-wider">
                  {role === "teacher" ? "शिक्षक मंच" : "विद्यार्थी मंच"}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition active:scale-95 cursor-pointer text-base font-bold"
              title="मेनू बंद करें"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links Scrollable Container */}
          <div className="px-3 flex-1 overflow-y-auto space-y-1.5 pr-2">


            <p className="text-[11px] font-bold text-blue-200/80 uppercase tracking-wider px-3 mb-1">
              {role === "teacher"
                ? "शिक्षण मेनू (13 सुविधाएं)"
                : "विद्यार्थी अध्ययन मेनू (9 सुविधाएं)"}
            </p>

            <nav className="flex flex-col gap-1.5">
              {role === "teacher" ? (
                <>
                  {/* 1. डैशबोर्ड (Dashboard) */}
                  <TeacherNavItem
                    to={`${base}`}
                    label="1. डैशबोर्ड"
                    icon="🏠"
                    onClick={onClose}
                    end
                  />

                  {/* 2. प्रोफ़ाइल (Profile) */}
                  <TeacherNavItem
                    to={`${base}/profile`}
                    label="2. प्रोफ़ाइल"
                    icon="👤"
                    onClick={onClose}
                  />

                  {/* 3. सूचनाएं (Notifications) */}
                  <TeacherNavItem
                    to={`${base}/notifications`}
                    label="3. सूचनाएं"
                    icon="🔔"
                    onClick={onClose}
                  />

                  {/* 4. लाइव कक्षा (Live Classroom) */}
                  <TeacherNavItem
                    to={`${base}/liveclass`}
                    label="4. लाइव कक्षा"
                    icon="🎙️"
                    onClick={onClose}
                  />

                  {/* 5. क्विज़ शेड्यूलिंग (Quiz Schedule) */}
                  <TeacherNavItem
                    to={`${base}/quiz-schedule`}
                    label="5. क्विज़ शेड्यूलिंग"
                    icon="🧠"
                    onClick={onClose}
                  />

                  {/* 6. दस्तावेज़ अपलोड (Upload Documents) */}
                  <TeacherNavItem
                    to={`${base}/documents`}
                    label="6. दस्तावेज़ अपलोड"
                    icon="📂"
                    onClick={onClose}
                  />

                  {/* 7. पाठ योजना (Lesson Plans) */}
                  <TeacherNavItem
                    to={`${base}/lesson-planner`}
                    label="7. पाठ योजना"
                    icon="📖"
                    onClick={onClose}
                  />

                  {/* 8. अभ्यास पत्रक (Worksheets) */}
                  <TeacherNavItem
                    to={`${base}/worksheets`}
                    label="8. अभ्यास पत्रक"
                    icon="📝"
                    onClick={onClose}
                  />

                  {/* 9. फ़्लैशकार्ड्स (Flashcards) */}
                  <TeacherNavItem
                    to={`${base}/flashcards`}
                    label="9. फ़्लैशकार्ड्स"
                    icon="🎴"
                    onClick={onClose}
                  />

                  {/* 10. प्रगति ट्रैकर (Progress Tracker) */}
                  <TeacherNavItem
                    to={`${base}/progress`}
                    label="10. प्रगति ट्रैकर"
                    icon="📊"
                    onClick={onClose}
                  />

                  {/* 11. ऑफ़लाइन सिंक (Offline Sync) */}
                  <TeacherNavItem
                    to={`${base}/offline-sync`}
                    label="11. ऑफ़लाइन सिंक"
                    icon="🔄"
                    onClick={onClose}
                  />

                  {/* 12. सेटिंग्स (Settings) */}
                  <TeacherNavItem
                    to={`${base}/settings`}
                    label="12. सेटिंग्स"
                    icon="⚙️"
                    onClick={onClose}
                  />

                  {/* 13. लॉगआउट (Logout) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full font-bold text-xs md:text-sm text-red-200 hover:bg-red-500/20 hover:text-white transition duration-150 text-left mt-2 border border-red-400/20 cursor-pointer"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <span className="text-base leading-none">🚪</span>
                    <span>13. साइनआउट / लॉगआउट</span>
                  </button>
                </>
              ) : (
                /* Complete 9-Item Student Sidebar Structure */
                <>
                  {/* 🏠 1. डैशबोर्ड - href="/dashboard" */}
                  <StudentNavItem
                    to="/dashboard"
                    label="1. डैशबोर्ड"
                    icon="🏠"
                    isActive={isStudentItemActive("/dashboard")}
                    onClick={onClose}
                  />

                  {/* 🎙️ 2. लाइव कक्षा - href="/live-class" */}
                  <StudentNavItem
                    to="/live-class"
                    label="2. लाइव कक्षा"
                    icon="🎙️"
                    isActive={isStudentItemActive("/live-class")}
                    onClick={onClose}
                  />

                  {/* 📝 3. अभ्यास पत्रक - href="/worksheets" */}
                  <StudentNavItem
                    to="/worksheets"
                    label="3. अभ्यास पत्रक"
                    icon="📝"
                    isActive={isStudentItemActive("/worksheets")}
                    onClick={onClose}
                  />

                  {/* 🎯 क्विज़ व मूल्यांकन - href="/quiz" */}
                  <StudentNavItem
                    to="/quiz"
                    label="क्विज़ व मूल्यांकन"
                    icon="🎯"
                    isActive={isStudentItemActive("/quiz")}
                    onClick={onClose}
                  />

                  {/* 🎴 4. सचित्र शब्द कार्ड - href="/flashcards" */}
                  <StudentNavItem
                    to="/flashcards"
                    label="4. सचित्र शब्द कार्ड"
                    icon="🎴"
                    isActive={isStudentItemActive("/flashcards")}
                    onClick={onClose}
                  />

                  {/* 🎨 5. चित्रकला व रंग भरो - href="/drawing-canvas" */}
                  <StudentNavItem
                    to="/drawing-canvas"
                    label="5. चित्रकला व रंग भरो"
                    icon="🎨"
                    isActive={isStudentItemActive("/drawing-canvas")}
                    onClick={onClose}
                  />

                  {/* 🎧 6. कहानियाँ - href="/audio-library" */}
                  <StudentNavItem
                    to="/audio-library"
                    label="6. कहानियाँ"
                    icon="🎧"
                    isActive={isStudentItemActive("/audio-library")}
                    onClick={onClose}
                  />

                  {/* 👤 7. मेरी प्रोफ़ाइल - href="/profile" */}
                  <StudentNavItem
                    to="/profile"
                    label="7. मेरी प्रोफ़ाइल"
                    icon="👤"
                    isActive={isStudentItemActive("/profile")}
                    onClick={onClose}
                  />

                  {/* ⚙️ 8. सेटिंग्स - href="/settings" */}
                  <StudentNavItem
                    to="/settings"
                    label="8. सेटिंग्स"
                    icon="⚙️"
                    isActive={isStudentItemActive("/settings")}
                    onClick={onClose}
                  />

                  {/* 🚪 9. साइनआउट / लॉगआउट - onClick={handleLogout} */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                      handleLogout();
                    }}
                    className="student-nav-item w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-xs md:text-sm transition-all duration-150 text-left mt-2 border border-white/10 cursor-pointer"
                    style={{
                      backgroundColor: "transparent",
                      color: "#FFFFFF",
                    }}
                  >
                    <span className="text-base leading-none shrink-0">🚪</span>
                    <span className="truncate">9. साइनआउट / लॉगआउट</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

/**
 * Dedicated Student Navigation Item adhering strictly to:
 * - Inactive: background: transparent, color: #FFFFFF, clean icons
 * - Active: dynamically applies .active class, solid white pill container (#FFFFFF),
 *   dark blue bold text (#1E56A0), font-weight: 700
 * - NO hardcoded white background classes on inactive items
 */
function StudentNavItem({
  to,
  label,
  icon,
  isActive,
  badge,
  onClick,
}: {
  to: string;
  label: string;
  icon: string;
  isActive: boolean;
  badge?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={`student-nav-item flex items-center gap-3.5 px-4 py-2.5 rounded-full text-xs md:text-sm transition-all duration-150 ${
        isActive
          ? "active bg-white text-[#1E56A0] font-bold shadow-md"
          : "bg-transparent text-white font-medium hover:bg-white/10"
      }`}
      style={
        isActive
          ? {
              backgroundColor: "#FFFFFF",
              color: "#1E56A0",
              fontWeight: 700,
            }
          : {
              backgroundColor: "transparent",
              color: "#FFFFFF",
            }
      }
    >
      <span className="text-base leading-none shrink-0">{icon}</span>
      <span className="truncate flex-1">{label}</span>
      {badge && <span className="shrink-0">{badge}</span>}
    </NavLink>
  );
}

function TeacherNavItem({
  to,
  label,
  icon,
  end = false,
  onClick,
}: {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3.5 px-4 py-2.5 rounded-full text-xs md:text-sm transition-all duration-150 ${
          isActive
            ? "active bg-white text-[#1E56A0] font-bold shadow-md"
            : "bg-transparent text-white font-medium hover:bg-white/10"
        }`
      }
      style={({ isActive }) =>
        isActive
          ? {
              backgroundColor: "#FFFFFF",
              color: "#1E56A0",
              fontWeight: 700,
            }
          : {
              backgroundColor: "transparent",
              color: "#FFFFFF",
            }
      }
    >
      <span className="text-base leading-none shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}