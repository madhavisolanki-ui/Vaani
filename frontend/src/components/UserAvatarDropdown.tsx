import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

type UserAvatarProps = {
  role: "teacher" | "student";
};

export default function UserAvatarDropdown({ role }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    userName:
      localStorage.getItem("userName") ||
      (role === "teacher" ? "शिक्षक" : "विद्यार्थी"),
    userPhoto: localStorage.getItem("userPhoto") || localStorage.getItem("studentAvatar") || "",
  });

  const loadProfile = () => {
    setProfile({
      userName:
        localStorage.getItem("userName") ||
        (role === "teacher" ? "शिक्षक" : "विद्यार्थी"),
      userPhoto: localStorage.getItem("userPhoto") || localStorage.getItem("studentAvatar") || "",
    });
  };

  useEffect(() => {
    window.addEventListener("userProfileUpdated", loadProfile);
    window.addEventListener("storage", loadProfile);
    return () => {
      window.removeEventListener("userProfileUpdated", loadProfile);
      window.removeEventListener("storage", loadProfile);
    };
  }, [role]);

  const { userName, userPhoto } = profile;
  const isEmojiPhoto = Boolean(userPhoto && userPhoto.length <= 4 && !userPhoto.startsWith("http") && !userPhoto.startsWith("data:"));
  const initial = (userName.charAt(0) || (role === "teacher" ? "T" : "S")).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsRefreshing(true);
    loadProfile();
    window.dispatchEvent(new Event("userProfileUpdated"));
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 350);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userSchool");
    localStorage.removeItem("userAddress");
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-2" ref={dropdownRef}>
      {/* 1-Tap Quick Refresh Option right next to Avatar circle */}
      <button
        type="button"
        onClick={handleRefresh}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition active:scale-95 border border-white/20 shadow-2xs"
        title="डेटा व पेज रिफ्रेश करें"
      >
        <span className={`text-sm ${isRefreshing ? "animate-spin" : ""}`}>🔄</span>
        <span className="hidden sm:inline text-[11px] font-extrabold">रिफ्रेश</span>
      </button>

      {/* Avatar Trigger Circle */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-white/10 transition duration-150 focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
          title={role === "teacher" ? "शिक्षक प्रोफ़ाइल" : "विद्यार्थी प्रोफ़ाइल"}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#1E56A0] font-black text-sm flex items-center justify-center shadow-md overflow-hidden">
              {isEmojiPhoto ? (
                <span className="text-xl">{userPhoto}</span>
              ) : userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-[#1E56A0] rounded-full"></span>
          </div>

          <div className="hidden sm:block text-left pr-1">
            <p className="text-xs font-black text-white leading-tight">
              {userName}
            </p>
            <p className="text-[10px] text-blue-200 font-bold leading-tight capitalize">
              {role === "teacher" ? "शिक्षक" : (localStorage.getItem("studentGrade") || "विद्यार्थी")}
            </p>
          </div>

          <span className="text-blue-200 text-xs hidden sm:inline">
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-[#EEF2FF] rounded-[16px] shadow-xl border border-[#C7D2FE] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#0F172A]">
            {/* User Profile Card Header */}
            <div className="px-4 pb-3 border-b border-[#C7D2FE]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#1E56A0] text-white font-black text-base flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                  {isEmojiPhoto ? (
                    <span className="text-2xl">{userPhoto}</span>
                  ) : userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {userName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] font-black text-[#1E56A0] bg-white px-2 py-0.5 rounded-md border border-[#C7D2FE]">
                      {role === "teacher" ? "👨‍🏫 शिक्षक" : (localStorage.getItem("studentGrade") || "कक्षा 1")}
                    </span>
                    {role === "student" && (
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        ⭐ {localStorage.getItem("studentStars") || "24"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Options: Profile, Settings, and Sign Out */}
            <div className="py-2 px-3 space-y-2">
              {role === "student" && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black text-[#1E56A0] bg-white border border-[#C7D2FE] hover:bg-blue-50 transition shadow-2xs"
                  >
                    <span className="text-base">👤</span>
                    <span>मेरी प्रोफ़ाइल</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-[#C7D2FE] hover:bg-blue-50 transition shadow-2xs"
                  >
                    <span className="text-base">⚙️</span>
                    <span>सेटिंग्स</span>
                  </Link>
                </>
              )}

              {role === "teacher" && (
                <>
                  <Link
                    to="/teacher/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black text-[#1E56A0] bg-white border border-[#C7D2FE] hover:bg-blue-50 transition shadow-2xs"
                  >
                    <span className="text-base">👤</span>
                    <span>मेरी प्रोफ़ाइल</span>
                  </Link>

                  <Link
                    to="/teacher/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-[#C7D2FE] hover:bg-blue-50 transition shadow-2xs"
                  >
                    <span className="text-base">⚙️</span>
                    <span>सेटिंग्स</span>
                  </Link>
                </>
              )}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-white border border-[#C7D2FE] hover:bg-red-50 transition text-left shadow-2xs cursor-pointer"
              >
                <span className="text-base">🚪</span>
                <span>लॉग आउट / साइन आउट</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
