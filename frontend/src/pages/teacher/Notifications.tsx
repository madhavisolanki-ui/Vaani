import { useState } from "react";
import { Link } from "react-router-dom";

interface NotificationItem {
  id: string;
  category: "sync" | "fln" | "govt";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "normal";
  icon: string;
  source: string;
}

export default function TeacherNotifications() {
  const [filter, setFilter] = useState<"all" | "sync" | "fln" | "govt">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif_1",
      category: "govt",
      title: "स्कूली शिक्षा एवं साक्षरता विभाग, झारखण्ड - पलाश बहुभाषी शिक्षण निर्देश",
      description:
        "प्राथमिक विद्यालयों (कक्षा 1 और 2) में जनजातीय बच्चों के लिए मातृभाषा-आधारित बहुभाषी शिक्षण सत्रों का अनिवार्य दैनिक संचालन सुनिश्चित करें।",
      timestamp: "आज, 09:15 AM",
      isRead: false,
      priority: "high",
      icon: "🏛️",
      source: "झारखण्ड शिक्षा परियोजना परिषद्",
    },
    {
      id: "notif_2",
      category: "fln",
      title: "निपुण भारत बुनियादी शिक्षण मॉड्यूल उपलब्ध",
      description:
        "संख्या बोध (1 से 20) और स्थानिक समझ के लिए नए द्विभाषी ऑडियो-विजुअल पाठ योजनाएं और वर्कशीट स्टूडियो में उपलब्ध करा दी गई हैं।",
      timestamp: "कल, 04:30 PM",
      isRead: false,
      priority: "normal",
      icon: "🎯",
      source: "निपुण भारत मिशन प्रकोष्ठ",
    },
    {
      id: "notif_3",
      category: "sync",
      title: "ऑफ़लाइन डेटा एवं छात्र मूल्यांकन सिंक पूर्ण",
      description:
        "टैबलेट से 14 छात्रों के मौखिक मूल्यांकन और कक्षा उपस्थिति का डेटा केंद्रीय पलाश सर्वर पर सुरक्षित सिंक हो चुका है।",
      timestamp: "कल, 01:20 PM",
      isRead: true,
      priority: "normal",
      icon: "🔄",
      source: "वाणीसेतु ऑफ़लाइन एआई इंजन",
    },
    {
      id: "notif_4",
      category: "sync",
      title: "मुंडारी भाषा ऑफ़लाइन वॉयस मॉडल नया संस्करण उपलब्ध",
      description:
        "बेहतर गति और स्पष्ट उच्चारण के लिए 120 एमबी का नया एआई मॉडल उपलब्ध है। सेटिंग्स से अपडेट करें।",
      timestamp: "08 अक्टूबर, 11:00 AM",
      isRead: true,
      priority: "normal",
      icon: "📦",
      source: "एआई भाषा इंजन",
    },
    {
      id: "notif_5",
      category: "govt",
      title: "निपुण भारत बुनियादी साक्षरता एवं संख्यात्मकता त्रैमासिक आकलन",
      description:
        "कक्षा 1 और 2 के सभी बच्चों का मौखिक भाषा और प्रारंभिक गणित का त्रैमासिक मूल्यांकन इस सप्ताह के अंत तक पूरा किया जाना है।",
      timestamp: "06 अक्टूबर, 10:00 AM",
      isRead: true,
      priority: "high",
      icon: "📋",
      source: "ज़िला शिक्षा पदाधिकारी, खूंटी",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.category === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans pb-16">
      {/* 1. Header Banner: Royal Blue to Violet gradient banner */}
      <div 
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
        className="p-6 sm:p-8 rounded-[20px] shadow-lg shadow-indigo-950/15 border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden text-white"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Glassmorphism badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span 
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              className="text-white text-xs font-black px-3 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-2xs uppercase tracking-wide"
            >
              सूचना एवं चेतावनी केंद्र
            </span>
            {unreadCount > 0 && (
              <span 
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                className="text-white text-xs font-black px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-2xs flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {unreadCount} नई सूचनाएं
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            🔔 सूचनाएं एवं सरकारी निर्देश
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1 max-w-2xl leading-relaxed">
            सिंक अलर्ट, नए निपुण भारत अपडेट एवं स्कूली शिक्षा विभाग के दिशा-निर्देश एक ही स्थान पर देखें।
          </p>
        </div>

        {/* CTA Buttons in Banner */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/teacher"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            className="px-4 py-2.5 rounded-xl border border-white/30 text-white hover:bg-white/30 text-xs font-black transition backdrop-blur-md shadow-2xs flex items-center gap-1.5"
          >
            <span>⬅</span>
            <span>डैशबोर्ड</span>
          </Link>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
              className="text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-950/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <span>✓</span>
              <span>सभी को पढ़ा हुआ चिन्हित करें</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter Tabs: Active solid Indigo (#4F46E5), Inactive Pure White (#FFFFFF) & Periwinkle (#DBEAFE) */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition border shadow-2xs cursor-pointer ${
            filter === "all"
              ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm"
              : "bg-[#FFFFFF] text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF] hover:border-[#C7D2FE]"
          }`}
        >
          सभी सूचनाएं ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("sync")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition border shadow-2xs cursor-pointer ${
            filter === "sync"
              ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm"
              : "bg-[#FFFFFF] text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF] hover:border-[#C7D2FE]"
          }`}
        >
          🔄 सिंक अलर्ट ({notifications.filter((n) => n.category === "sync").length})
        </button>
        <button
          onClick={() => setFilter("fln")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition border shadow-2xs cursor-pointer ${
            filter === "fln"
              ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm"
              : "bg-[#FFFFFF] text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF] hover:border-[#C7D2FE]"
          }`}
        >
          🎯 निपुण भारत अपडेट्स ({notifications.filter((n) => n.category === "fln").length})
        </button>
        <button
          onClick={() => setFilter("govt")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition border shadow-2xs cursor-pointer ${
            filter === "govt"
              ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm"
              : "bg-[#FFFFFF] text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF] hover:border-[#C7D2FE]"
          }`}
        >
          🏛️ सरकारी निर्देश ({notifications.filter((n) => n.category === "govt").length})
        </button>
      </div>

      {/* 3. Notification Cards: Pure White (#FFFFFF) with Periwinkle outline (#DBEAFE) & soft blue badges */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-[#FFFFFF] p-12 rounded-[16px] text-center border border-[#DBEAFE] shadow-2xs">
            <div className="w-16 h-16 bg-[#EFF6FF] text-[#4F46E5] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 border border-[#DBEAFE] shadow-2xs">
              🎉
            </div>
            <h3 className="text-base font-bold text-slate-800">
              इस श्रेणी में कोई नई सूचना नहीं है
            </h3>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleRead(item.id)}
              className={`bg-[#FFFFFF] p-5 sm:p-6 rounded-[16px] border border-[#DBEAFE] transition-all cursor-pointer hover:shadow-md flex items-start gap-4 shadow-2xs ${
                !item.isRead
                  ? "ring-2 ring-[#4F46E5]/30 border-[#C7D2FE]"
                  : ""
              }`}
            >
              <div
                className="w-12 h-12 rounded-[12px] bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-xl shrink-0 shadow-2xs"
              >
                {item.icon}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#DBEAFE] shadow-2xs">
                      {item.source}
                    </span>
                    {!item.isRead && (
                      <span className="bg-[#DBEAFE] text-[#1E40AF] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#BFDBFE] shadow-2xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] animate-pulse"></span>
                        नया
                      </span>
                    )}
                    {item.priority === "high" && (
                      <span className="bg-[#DBEAFE] text-[#1E40AF] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#BFDBFE] shadow-2xs">
                        महत्वपूर्ण
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-600 font-semibold bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#DBEAFE] shadow-2xs">
                    ⏰ {item.timestamp}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#0F172A] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
