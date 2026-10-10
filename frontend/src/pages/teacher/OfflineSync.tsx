import { useState } from "react";
import { Link } from "react-router-dom";

export default function TeacherOfflineSync() {
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("आज, 08:30 AM (सफल)");

  const [models] = useState([
    {
      id: "mun",
      name: "मुंडारी एआई वॉयस व अनुवाद मॉडल",
      size: "120 एमबी",
      status: "डाउनलोड किया गया (सक्रिय)",
      version: "संस्करण 2.4",
      ready: true,
    },
    {
      id: "ho",
      name: "हो एआई वॉयस व अनुवाद मॉडल",
      size: "110 एमबी",
      status: "डाउनलोड किया गया (सक्रिय)",
      version: "संस्करण 2.1",
      ready: true,
    },
    {
      id: "san",
      name: "संथाली वॉयस व ओल चिकी लिपि मॉडल",
      size: "145 एमबी",
      status: "डाउनलोड किया गया (सक्रिय)",
      version: "संस्करण 2.8",
      ready: true,
    },
  ]);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      const now = new Date();
      setLastSyncTime(
        `आज, ${now.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })} (सफल)`
      );
      setTimeout(() => setSyncSuccess(false), 3500);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans pb-16">
      {/* 1. Header Banner */}
      <div
        className="p-6 sm:p-8 rounded-[20px] text-white shadow-md flex flex-wrap items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="text-xs font-black px-3 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-xs uppercase tracking-wide text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              ऑफ़लाइन एआई व डेटा सिंक
            </span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-xs text-white flex items-center gap-1.5"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              बिना इंटरनेट (ऑफ़लाइन) तैयार
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            🔄 ऑफ़लाइन सिंक एवं मॉडल प्रबंधन
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            दूरदराज के विद्यालयों में बिना इंटरनेट के भी टैबलेट पर लाइव अनुवाद और शिक्षण संचालित रखें।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/teacher"
            className="px-4 py-2.5 rounded-xl border border-white/30 text-xs font-bold text-white hover:bg-white/20 transition shadow-xs backdrop-blur-md"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          >
            ⬅ डैशबोर्ड
          </Link>
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={syncing}
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            className="text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:opacity-95 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <span className={syncing ? "animate-spin" : ""}>🔄</span>
            <span>{syncing ? "डेटा सिंक हो रहा है..." : "अब सिंक करें"}</span>
          </button>
        </div>
      </div>

      {/* Sync Success Alert */}
      {syncSuccess && (
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] text-[#1E40AF] text-xs sm:text-sm font-black p-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">✓</span>
            <span>
              छात्र मूल्यांकन, उपस्थिति और नई पाठ योजनाएं केंद्रीय पलाश सर्वर से सफलतापूर्वक सिंक हो गईं!
            </span>
          </div>
        </div>
      )}

      {/* 2. Tablet Storage & Memory Status (2GB RAM / 16GB Storage) */}
      <div className="bg-white p-6 sm:p-7 rounded-[16px] border border-[#DBEAFE] shadow-xs space-y-4">
        <h2 className="text-base font-black text-[#0F172A] border-b border-[#DBEAFE] pb-3">
          📱 टैबलेट स्टोरेज एवं मेमोरी स्थिति (2 जीबी रैम / 16 जीबी स्टोरेज)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-[#DBEAFE] shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-600">कुल स्टोरेज उपयोग</span>
            <div className="text-xl font-black text-[#1E3A8A]">1.2 जीबी / 16 जीबी</div>
            <div className="w-full bg-[#EFF6FF] border border-[#DBEAFE] h-2.5 rounded-full overflow-hidden mt-2 p-0.5 shadow-2xs">
              <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: "7.5%" }}></div>
            </div>
            <span className="text-[10px] text-[#1E40AF] font-bold block mt-1">14.8 जीबी खाली उपलब्ध</span>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-[#DBEAFE] shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-600">अंतिम सिंक समय</span>
            <div className="text-base font-black text-[#1E3A8A]">{lastSyncTime}</div>
            <span className="text-[10px] text-slate-500 block">नेटवर्क मिलने पर स्वतः सिंक सक्रिय</span>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-[#DBEAFE] shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-600">ऑफ़लाइन कैश स्थिति</span>
            <div className="text-base font-black text-[#1E3A8A]">48 पाठ योजनाएं सुरक्षित</div>
            <span className="text-[10px] text-slate-500 block">सभी वर्कशीट्स व फ्लैशकार्ड्स ऑफ़लाइन उपलब्ध</span>
          </div>
        </div>
      </div>

      {/* 3. Downloaded Offline Language Models */}
      <div className="bg-white p-6 sm:p-7 rounded-[16px] border border-[#DBEAFE] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DBEAFE] pb-3">
          <h2 className="text-base font-black text-[#0F172A]">
            📦 ऑफ़लाइन भाषा मॉडल्स (डाउनलोड स्थिति)
          </h2>
          <span className="text-xs font-bold text-[#1E40AF] bg-[#DBEAFE] px-2.5 py-0.5 rounded-md border border-[#DBEAFE] shadow-2xs">
            3/3 मॉडल्स तैयार
          </span>
        </div>

        <div className="divide-y divide-[#DBEAFE]">
          {models.map((m) => (
            <div
              key={m.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC] p-2 rounded-xl transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE] shadow-2xs flex items-center justify-center text-lg shrink-0">
                  🗣️
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0F172A]">{m.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-600 font-semibold">
                      आकार: {m.size} • संस्करण: {m.version}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="bg-[#DBEAFE] text-[#1E40AF] text-xs font-black px-3 py-1 rounded-full border border-[#DBEAFE] shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E40AF]"></span>
                  {m.status}
                </span>
                <button
                  type="button"
                  onClick={() => alert(`"${m.name}" नवीनतम संस्करण में पहले से अपडेट है।`)}
                  className="px-3 py-1.5 rounded-xl border border-[#DBEAFE] bg-white text-xs font-bold text-slate-700 hover:bg-[#F8FAFC] transition shadow-2xs"
                >
                  जाँचें
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
