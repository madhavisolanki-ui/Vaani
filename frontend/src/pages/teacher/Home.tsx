import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000/api";

const DEFAULT_HOME_SUBJECT_COUNTS: Record<string, number> = {
  "गणित": 22,
  "भाषा व पर्यावरण": 18,
  "हिंदी": 14,
  "विज्ञान": 9,
  "सामाजिक अध्ययन": 7,
  "FLN बुनियादी साक्षरता": 12,
};

function getHomeStoredSubjectCounts(): Record<string, number> {
  const saved = localStorage.getItem("completedClassesCountBySubject");
  if (saved) {
    try {
      return { ...DEFAULT_HOME_SUBJECT_COUNTS, ...JSON.parse(saved) };
    } catch (e) {}
  }
  return { ...DEFAULT_HOME_SUBJECT_COUNTS };
}

export default function TeacherHome() {
  const [teacherName, setTeacherName] = useState(
    localStorage.getItem("userName") || "माधवी"
  );
  const [preferredLang, setPreferredLang] = useState(
    localStorage.getItem("preferredLang") || "mun"
  );
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>(getHomeStoredSubjectCounts);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })
  );
  const [showAllQuickAccess, setShowAllQuickAccess] = useState(false);

  // 11 distinct sidebar features for quick access
  const allSidebarFeatures = [
    {
      id: "liveclass",
      title: "लाइव कक्षा",
      icon: "🎙️",
      to: "/teacher/liveclass",
      actionText: "कक्षा शुरू करें",
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#2563EB]",
      actionColor: "text-[#2563EB]",
    },
    {
      id: "quiz-schedule",
      title: "क्विज़ शेड्यूलिंग",
      icon: "🧠",
      to: "/teacher/quiz-schedule",
      actionText: "क्विज़ बनाएं",
      iconBg: "bg-[#EFF6FF] text-[#4F46E5] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#4F46E5]",
      actionColor: "text-[#4F46E5]",
    },
    {
      id: "lesson-planner",
      title: "पाठ योजना",
      icon: "📖",
      to: "/teacher/lesson-planner",
      actionText: "योजना बनाएं",
      iconBg: "bg-[#EFF6FF] text-[#1E3A8A] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#1E3A8A]",
      actionColor: "text-[#1E3A8A]",
    },
    {
      id: "worksheets",
      title: "अभ्यास पत्रक",
      icon: "📝",
      to: "/teacher/worksheets",
      actionText: "वर्कशीट बनाएं",
      iconBg: "bg-[#EFF6FF] text-[#7C3AED] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#7C3AED]",
      actionColor: "text-[#7C3AED]",
    },
    {
      id: "flashcards",
      title: "फ़्लैशकार्ड्स",
      icon: "🎴",
      to: "/teacher/flashcards",
      actionText: "कार्ड्स देखें",
      iconBg: "bg-[#EFF6FF] text-[#6366F1] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#6366F1]",
      actionColor: "text-[#6366F1]",
    },
    {
      id: "documents",
      title: "दस्तावेज़ अपलोड",
      icon: "📂",
      to: "/teacher/documents",
      actionText: "फ़ाइल अपलोड",
      iconBg: "bg-[#EFF6FF] text-[#4F46E5] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#4F46E5]",
      actionColor: "text-[#4F46E5]",
    },
    {
      id: "progress",
      title: "प्रगति ट्रैकर",
      icon: "📊",
      to: "/teacher/progress",
      actionText: "ट्रैकर खोलें",
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#2563EB]",
      actionColor: "text-[#2563EB]",
    },
    {
      id: "offline-sync",
      title: "ऑफ़लाइन सिंक",
      icon: "🔄",
      to: "/teacher/offline-sync",
      actionText: "सिंक स्थिति",
      iconBg: "bg-[#EFF6FF] text-[#0284C7] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#0284C7]",
      actionColor: "text-[#0284C7]",
    },
    {
      id: "notifications",
      title: "सूचनाएं व निर्देश",
      icon: "🔔",
      to: "/teacher/notifications",
      actionText: "सूचनाएं देखें",
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#2563EB]",
      actionColor: "text-[#2563EB]",
    },
    {
      id: "profile",
      title: "शिक्षक प्रोफ़ाइल",
      icon: "👤",
      to: "/teacher/profile",
      actionText: "प्रोफ़ाइल देखें",
      iconBg: "bg-[#EFF6FF] text-[#4F46E5] border-[#DBEAFE]",
      hoverBorder: "hover:border-[#4F46E5]",
      actionColor: "text-[#4F46E5]",
    },
    {
      id: "settings",
      title: "शिक्षक सेटिंग्स",
      icon: "⚙️",
      to: "/teacher/settings",
      actionText: "सेटिंग्स खोलें",
      iconBg: "bg-[#EFF6FF] text-slate-700 border-[#DBEAFE]",
      hoverBorder: "hover:border-slate-500",
      actionColor: "text-slate-700",
    },
  ];

  const cleanHindiText = (text: string | undefined): string => {
    if (!text) return "";
    let cleaned = text;
    cleaned = cleaned.replace(/Grade\s*\d+\s*\(([^)]+)\)/gi, "$1");
    cleaned = cleaned.replace(/\s*\([A-Za-z0-9\s\-_/&.,]+\)/g, "");
    cleaned = cleaned.replace(/Grade\s*\d+\s*/gi, "");
    cleaned = cleaned.replace(/\bFLN\b/gi, "");
    cleaned = cleaned.replace(/\bNumeracy\b/gi, "संख्या ज्ञान");
    cleaned = cleaned.replace(/\bLiteracy\b/gi, "भाषा ज्ञान");
    cleaned = cleaned.replace(/\bCounting\b/gi, "गिनती");
    cleaned = cleaned.replace(/\bMundari\b/gi, "मुंडारी");
    cleaned = cleaned.replace(/\bSanthali\b/gi, "संथाली");
    cleaned = cleaned.replace(/\bHo\b/gi, "हो");
    cleaned = cleaned.replace(/\s{2,}/g, " ");
    return cleaned.trim();
  };

  const loadQuizzes = () => {
    const saved = localStorage.getItem("scheduledQuizzes");
    if (saved) {
      try {
        const raw = JSON.parse(saved);
        const cleaned = raw.map((q: any) => ({
          ...q,
          title: cleanHindiText(q.title),
          subject: cleanHindiText(q.subject),
          grade: cleanHindiText(q.grade),
          targetLangLabel: cleanHindiText(q.targetLangLabel),
        }));
        setUpcomingQuizzes(cleaned);
        return;
      } catch (e) {
        console.error(e);
      }
    }
    // Default fallback quizzes
    setUpcomingQuizzes([
      {
        id: "quiz_101",
        title: "गिनती 1 से 10 और संख्या बोध",
        grade: "कक्षा 1",
        subject: "गणित",
        targetLangLabel: "मुंडारी",
        date: "आज",
        startTime: "सुबह 10:30 बजे",
        durationMinutes: 15,
        status: "live",
      },
      {
        id: "quiz_102",
        title: "रंग, आकार और हमारे आस-पास के जानवर",
        grade: "कक्षा 2",
        subject: "भाषा व पर्यावरण",
        targetLangLabel: "संथाली",
        date: "कल",
        startTime: "सुबह 11:30 बजे",
        durationMinutes: 20,
        status: "scheduled",
      },
    ]);
  };

  // Sync profile, language, quiz & subject class counts dynamically
  useEffect(() => {
    const handleUpdate = () => {
      setTeacherName(localStorage.getItem("userName") || "माधवी");
      setPreferredLang(localStorage.getItem("preferredLang") || "mun");
      setSubjectCounts(getHomeStoredSubjectCounts());
      loadQuizzes();
      fetchClasses();
    };

    loadQuizzes();
    window.addEventListener("userProfileUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("quizScheduledUpdated", handleUpdate);
    window.addEventListener("classCountUpdated", handleUpdate);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })
      );
    }, 60000);

    return () => {
      window.removeEventListener("userProfileUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("quizScheduledUpdated", handleUpdate);
      window.removeEventListener("classCountUpdated", handleUpdate);
      clearInterval(timer);
    };
  }, []);

  const langMap: Record<string, string> = {
    mun: "मुंडारी",
    ho: "हो",
    sat: "संथाली",
    san: "संथाली",
  };
  const targetLangLabel = langMap[preferredLang] || "मुंडारी";

  // Dynamic Time Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "सुप्रभात";
    if (hour < 17) return "शुभ दोपहर";
    return "शुभ संध्या";
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API}/curriculum/classes`);
      let rawClasses = res.data.classes || [];

      // Merge active schedule from localStorage
      const activeRaw = localStorage.getItem("activeLiveClassSchedule");
      if (activeRaw) {
        try {
          const activeParsed = JSON.parse(activeRaw);
          const existsIdx = rawClasses.findIndex((c: any) => c.id === activeParsed.id);
          if (existsIdx >= 0) {
            rawClasses[existsIdx] = { ...rawClasses[existsIdx], ...activeParsed };
          } else {
            rawClasses = [activeParsed, ...rawClasses];
          }
        } catch (e) {}
      }

      const sanitized = rawClasses.map((cls: any) => ({
        ...cls,
        subject: cleanHindiText(cls.subject),
        topic: cleanHindiText(cls.topic),
        medium: cleanHindiText(cls.medium) || "हिंदी",
        grade: cleanHindiText(cls.grade),
      }));
      setTodayClasses(sanitized);
    } catch (err) {
      console.error("Error fetching live classes:", err);
      const activeRaw = localStorage.getItem("activeLiveClassSchedule");
      let fallbackList: any[] = [];
      if (activeRaw) {
        try {
          fallbackList.push(JSON.parse(activeRaw));
        } catch (e) {}
      }
      setTodayClasses(fallbackList);
    }
  };

  const initial = (teacherName.charAt(0) || "T").toUpperCase();

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-full space-y-8 max-w-6xl mx-auto font-sans pb-16">
      {/* 1. वेलकम कार्ड (Welcome Banner) */}
      <div 
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
        className="border border-white/20 p-6 sm:p-8 rounded-[16px] shadow-md shadow-indigo-900/10 relative overflow-hidden text-white"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Top Badges: Date, Time, Pedagogy, NIPUN status - Translucent Glass Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/30 shadow-2xs">
                वाणीसेतु • प्राथमिक शिक्षण शास्त्र
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30 shadow-2xs flex items-center gap-1.5">
                <span>📅 {new Date().toLocaleDateString("hi-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}</span>
                <span>•</span>
                <span>⏰ {currentTime}</span>
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/30 shadow-2xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                🇮🇳 निपुण भारत मिशन • प्राथमिक स्तर
              </span>
            </div>

            {/* Greeting and Teacher Name */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {getGreeting()},{" "}
                <span className="text-white drop-shadow-xs">{teacherName}</span>! 👋
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1">
                आज का शिक्षण कार्यक्रम, विषयवार कक्षा आँकड़े, लाइव कक्षाएं एवं क्विज़ नीचे देखें।
              </p>
            </div>
          </div>

          {/* Animated Teacher Avatar Box */}
          <div className="shrink-0 flex items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg border-2 border-white/40 ring-4 ring-white/20 animate-in fade-in zoom-in duration-300">
              {initial}
            </div>
          </div>
        </div>
      </div>

      {/* 2. विषयवार क्लास काउंट कार्ड्स (Completed Class Metrics) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
            <span>📊</span>
            <span>विषयवार पूर्ण कक्षा आँकड़े</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            सत्र 2026-27 • प्राथमिक स्तर
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Classes */}
          <div className="bg-white p-5 rounded-[16px] border border-[#DBEAFE] shadow-2xs hover:shadow-md transition space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                कुल कक्षाएं
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-base shadow-2xs">
                🎓
              </span>
            </div>
            <div className="text-3xl font-black text-[#0F172A]">
              {Object.values(subjectCounts).reduce((a, b) => a + b, 0)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full inline-flex border border-[#DBEAFE] shadow-2xs">
              <span>✓</span>
              <span>100% सत्र संचालित</span>
            </div>
          </div>

          {/* Math Classes */}
          <div className="bg-white p-5 rounded-[16px] border border-[#DBEAFE] shadow-2xs hover:shadow-md transition space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                गणित
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-base shadow-2xs">
                🔢
              </span>
            </div>
            <div className="text-3xl font-black text-[#0F172A]">
              {subjectCounts["गणित"] || 22}
            </div>
            <p className="text-[11px] text-slate-600 font-semibold">
              संख्या बोध एवं संक्रियाएं
            </p>
          </div>

          {/* Language & EVS Classes */}
          <div className="bg-white p-5 rounded-[16px] border border-[#DBEAFE] shadow-2xs hover:shadow-md transition space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                भाषा व पर्यावरण
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-base shadow-2xs">
                📚
              </span>
            </div>
            <div className="text-3xl font-black text-[#0F172A]">
              {subjectCounts["भाषा व पर्यावरण"] || 18}
            </div>
            <p className="text-[11px] text-slate-600 font-semibold">
              मातृभाषा से हिंदी सेतु
            </p>
          </div>

          {/* Hindi / Other Subjects */}
          <div className="bg-white p-5 rounded-[16px] border border-[#DBEAFE] shadow-2xs hover:shadow-md transition space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                हिंदी व FLN
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-base shadow-2xs">
                📖
              </span>
            </div>
            <div className="text-3xl font-black text-[#0F172A]">
              {(subjectCounts["हिंदी"] || 0) + (subjectCounts["FLN बुनियादी साक्षरता"] || 0) || 26}
            </div>
            <p className="text-[11px] text-slate-600 font-semibold">
              साक्षरता व पठन अभ्यास
            </p>
          </div>
        </div>
      </div>

      {/* 3. आज की लाइव कक्षाएं (Upcoming/Active Live Classes) */}
      {(() => {
        const isClassExpired = (dateStr?: string, endTimeStr?: string) => {
          if (!endTimeStr) return false;
          try {
            const todayStr = new Date().toISOString().split("T")[0];
            const dStr = dateStr || todayStr;
            const [timePart, modifier] = endTimeStr.trim().split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (modifier?.toUpperCase() === "PM" && hours < 12) hours += 12;
            if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;
            const end = new Date(dStr);
            end.setHours(hours, minutes, 0, 0);
            return Date.now() >= end.getTime();
          } catch (e) {
            return false;
          }
        };

        const activeLiveClasses = todayClasses.filter((cls) => {
          const isEnded = cls.status === "ended" || cls.isExpired || cls.isLocked || isClassExpired(cls.date, cls.endTime);
          return !isEnded && cls.status === "live";
        });

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
                  <span>🎙️</span>
                  <span>आज की लाइव कक्षाएं</span>
                </h2>
                <span className="bg-[#EFF6FF] text-[#1E3A8A] text-xs font-black px-3 py-0.5 rounded-full border border-[#DBEAFE]">
                  {activeLiveClasses.length} सक्रिय लाइव
                </span>
              </div>
              <Link
                to="/teacher/liveclass"
                className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors flex items-center gap-1"
              >
                <span>सभी कक्षाएं व इतिहास देखें</span>
                <span>➔</span>
              </Link>
            </div>

            {activeLiveClasses.length === 0 ? (
              <div className="bg-white p-10 sm:p-12 rounded-[16px] text-center border border-[#DBEAFE] shadow-xs">
                <div className="w-16 h-16 bg-[#EFF6FF] text-[#2563EB] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 border border-[#DBEAFE] shadow-2xs">
                  🎉
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  वर्तमान में कोई सक्रिय लाइव कक्षा नहीं है
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  समाप्त हो चुकी कक्षाएं और पूर्ण इतिहास देखने के लिए लाइव क्लास पेज पर जाएं।
                </p>
                <Link
                  to="/teacher/liveclass"
                  style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all"
                >
                  <span>🎙️</span>
                  <span>लाइव क्लास पेज पर जाएं</span>
                  <span>➔</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeLiveClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-white rounded-[16px] border border-[#DBEAFE] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-stretch overflow-hidden"
                  >
                    {/* Left Vertical Blue Accent Strip */}
                    <div className="w-2.5 bg-gradient-to-b from-[#2563EB] to-[#7C3AED] self-stretch shrink-0 hidden md:block"></div>
                    <div className="h-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] w-full block md:hidden"></div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Left Details */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-red-50 text-red-700 text-xs font-black px-3 py-1 rounded-full border border-red-200 shadow-2xs flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            अभी लाइव
                          </span>

                          <span className="text-xs font-extrabold bg-[#EFF6FF] text-[#1E3A8A] px-3 py-1 rounded-full border border-[#DBEAFE] shadow-2xs">
                            ⏰ {cls.startTime} - {cls.endTime}
                          </span>

                          <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-full border border-[#DBEAFE] shadow-2xs">
                            🏫 {cleanHindiText(cls.grade)}
                          </span>

                          {/* Dynamic Auto-Translation Indicator Tag */}
                          <span className="text-xs font-black bg-[#EFF6FF] text-[#1E3A8A] border border-[#DBEAFE] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                            <span>🌐</span>
                            <span>लक्ष्य भाषा: {targetLangLabel}</span>
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-[#0F172A]">
                            {cleanHindiText(cls.topic)}
                          </h3>
                          <p className="text-xs text-slate-600 font-semibold mt-1">
                            📚 विषय: <span className="text-slate-900 font-bold">{cleanHindiText(cls.subject)}</span>
                          </p>
                        </div>

                        <div className="text-xs font-bold text-[#1E3A8A] bg-[#EFF6FF] inline-block px-3 py-1 rounded-lg border border-[#DBEAFE] shadow-2xs">
                          शिक्षण माध्यम: {cleanHindiText(cls.medium) || "हिंदी"}
                        </div>
                      </div>

                      {/* Right CTA Action Button */}
                      <div className="shrink-0 flex items-center gap-3">
                        <Link
                          to="/teacher/liveclass"
                          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                          className="px-6 py-3.5 rounded-2xl font-black text-xs text-white shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center gap-2"
                        >
                          <span>🎙️</span>
                          <span>लाइव कक्षा में प्रवेश करें</span>
                          <span>➔</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. आगामी क्विज़ विजेट (Upcoming FLN Quizzes Widget) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
              <span>🧠</span>
              <span>आगामी क्विज़</span>
            </h2>
            <span className="bg-[#EFF6FF] text-[#1E3A8A] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#DBEAFE]">
              🔊 ऑडियो सहायता सक्षम
            </span>
          </div>

          {/* Quick Schedule Quiz Button as requested */}
          <Link
            to="/teacher/quiz-schedule"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            className="text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5"
          >
            <span>📅</span>
            <span>नया क्विज़ शेड्यूल करें</span>
            <span>+</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingQuizzes.slice(0, 2).map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white p-5 sm:p-6 rounded-[16px] border border-[#DBEAFE] shadow-2xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {quiz.status === "live" ? (
                      <span className="bg-red-50 text-red-700 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-red-200 shadow-2xs animate-pulse">
                        ● अभी लाइव
                      </span>
                    ) : (
                      <span className="bg-[#EFF6FF] text-[#1E3A8A] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#DBEAFE] shadow-2xs">
                        ⏳ आगामी
                      </span>
                    )}
                    <span className="text-[11px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-[#DBEAFE] shadow-2xs">
                      {cleanHindiText(quiz.grade)}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#DBEAFE] shadow-2xs">
                    📅 {quiz.date} • {quiz.startTime}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#0F172A] leading-snug">
                  {cleanHindiText(quiz.title)}
                </h3>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="text-[11px] font-black text-[#1E3A8A] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#DBEAFE] shadow-2xs">
                    🌐 लक्ष्य भाषा: {cleanHindiText(quiz.targetLangLabel)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DBEAFE] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-[#DBEAFE] shadow-2xs">
                  ⏱️ {quiz.durationMinutes || 15} मिनट • 5 प्रश्न
                </span>

                <Link
                  to="/teacher/quiz-schedule"
                  className="text-xs font-black text-[#4F46E5] hover:text-[#7C3AED] flex items-center gap-1 group bg-[#EFF6FF] hover:bg-[#EEF2FF] px-3 py-1 rounded-md border border-[#DBEAFE] shadow-2xs transition"
                >
                  <span>क्विज़</span>
                  <span className="group-hover:translate-x-1 transition">➔</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. क्विक एक्सेस ग्रिड (Sidebar Features Quick Access) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
              <span>⚡</span>
              <span>क्विक एक्सेस ग्रिड</span>
            </h2>
            <span className="bg-[#EFF6FF] text-[#1E3A8A] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#DBEAFE] shadow-2xs">
              {showAllQuickAccess ? "सभी 11 फ़ीचर्स" : "प्राथमिक 5 फ़ीचर्स"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAllQuickAccess(!showAllQuickAccess)}
            className="text-xs font-black text-[#1E3A8A] bg-white hover:bg-[#EFF6FF] px-3.5 py-1.5 rounded-xl border border-[#DBEAFE] transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
          >
            <span>{showAllQuickAccess ? "▲ कम दिखाएं (5 फ़ीचर्स)" : "▼ और देखें (सभी 11 फ़ीचर्स)"}</span>
          </button>
        </div>

        {/* 6-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* If NOT expanded: render first 5 features + 6th 'More' card */}
          {!showAllQuickAccess ? (
            <>
              {allSidebarFeatures.slice(0, 5).map((feat) => (
                <Link
                  key={feat.id}
                  to={feat.to}
                  className="group bg-white p-5 rounded-[16px] border border-[#DBEAFE] hover:border-[#4F46E5] shadow-2xs hover:shadow-md transition-all duration-150 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-11 h-11 rounded-[12px] bg-[#EFF6FF] border border-[#DBEAFE] shadow-2xs flex items-center justify-center text-xl group-hover:scale-110 transition"
                      >
                        {feat.icon}
                      </div>
                    </div>
                    <h3 className="font-black text-sm text-[#0F172A] group-hover:text-[#4F46E5] transition">
                      {feat.title}
                    </h3>
                  </div>
                  <div
                    className={`pt-2 text-xs font-black ${feat.actionColor} flex items-center gap-1 group-hover:translate-x-1 transition`}
                  >
                    <span>{feat.actionText}</span>
                    <span>➔</span>
                  </div>
                </Link>
              ))}

              {/* 6th Item: More Button Card */}
              <button
                type="button"
                onClick={() => setShowAllQuickAccess(true)}
                className="group bg-[#EFF6FF] hover:bg-white p-5 rounded-[16px] border-2 border-dashed border-[#DBEAFE] hover:border-[#4F46E5] shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between text-left active:scale-95 cursor-pointer"
                title="बाकी सभी सुविधाएं देखें"
              >
                <div>
                  <div className="w-11 h-11 rounded-[12px] bg-white text-[#4F46E5] border border-[#DBEAFE] shadow-2xs flex items-center justify-center text-xl font-black group-hover:scale-110 transition">
                    ➕
                  </div>
                </div>
                <div className="pt-2 text-xs font-black text-[#4F46E5] flex items-center gap-1 group-hover:translate-x-1 transition">
                  <span>बाकी फ़ीचर्स देखें</span>
                  <span>➔</span>
                </div>
              </button>
            </>
          ) : (
            /* When expanded: show all 11 features + 12th 'कम देखें (Show Less)' card */
            <>
              {allSidebarFeatures.map((feat) => (
                <Link
                  key={feat.id}
                  to={feat.to}
                  className="group bg-white p-5 rounded-[16px] border border-[#DBEAFE] hover:border-[#4F46E5] shadow-2xs hover:shadow-md transition-all duration-150 space-y-3 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-11 h-11 rounded-[12px] bg-[#EFF6FF] border border-[#DBEAFE] shadow-2xs flex items-center justify-center text-xl group-hover:scale-110 transition"
                      >
                        {feat.icon}
                      </div>
                    </div>
                    <h3 className="font-black text-sm text-[#0F172A] group-hover:text-[#4F46E5] transition">
                      {feat.title}
                    </h3>
                  </div>
                  <div
                    className={`pt-2 text-xs font-black ${feat.actionColor} flex items-center gap-1 group-hover:translate-x-1 transition`}
                  >
                    <span>{feat.actionText}</span>
                    <span>➔</span>
                  </div>
                </Link>
              ))}

              {/* 12th Item: Show Less Button Card */}
              <button
                type="button"
                onClick={() => setShowAllQuickAccess(false)}
                className="group bg-[#EFF6FF] hover:bg-white p-5 rounded-[16px] border-2 border-dashed border-[#DBEAFE] hover:border-slate-500 shadow-2xs transition-all space-y-3 flex flex-col justify-between text-left active:scale-95 cursor-pointer animate-in fade-in"
                title="कम फ़ीचर्स दिखाएं"
              >
                <div>
                  <div className="w-11 h-11 rounded-[12px] bg-white text-slate-700 border border-[#DBEAFE] shadow-2xs flex items-center justify-center text-xl font-black group-hover:scale-110 transition">
                    ▲
                  </div>
                </div>
                <div className="pt-2 text-xs font-black text-slate-600 flex items-center gap-1 group-hover:-translate-y-0.5 transition">
                  <span>कम फ़ीचर्स देखें</span>
                  <span>▲</span>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}