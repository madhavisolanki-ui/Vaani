import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentPageBanner from "../../components/StudentPageBanner";
import {
  type StudentNotification,
  getStudentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/studentNotificationService";

export default function StudentNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "live_class" | "worksheet" | "quiz" | "feedback">("all");
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  useEffect(() => {
    loadNotifs();
    const handleUpdate = () => loadNotifs();
    window.addEventListener("student_notifications_updated", handleUpdate);
    return () => {
      window.removeEventListener("student_notifications_updated", handleUpdate);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const loadNotifs = () => {
    setNotifications(getStudentNotifications());
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    loadNotifs();
  };

  const handleItemClick = (notif: StudentNotification) => {
    markNotificationAsRead(notif.id);
    navigate(notif.ctaLink);
  };

  const handlePlayAudioNote = (notif: StudentNotification) => {
    if (!("speechSynthesis" in window) || !notif.audioNote) {
      alert("ऑडियो संदेश उपलब्ध नहीं है।");
      return;
    }

    if (playingAudioId === notif.id) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingAudioId(notif.id);

    const utterance = new SpeechSynthesisUtterance(notif.audioNote);
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setPlayingAudioId(null);
    utterance.onerror = () => setPlayingAudioId(null);

    window.speechSynthesis.speak(utterance);
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-4 sm:p-7 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 */}
      <StudentPageBanner
        icon="🔔"
        title="सूचनाएं व रियल-टाइम अपडेट्स"
        subtitle="नई लाइव कक्षाएं, अभ्यास पत्रक, क्विज़ और शिक्षक समीक्षा संदेश एक ही स्थान पर"
        tag={unreadCount > 0 ? `🔴 ${unreadCount} नई सूचनाएं` : "✓ सभी पढ़ी जा चुकी हैं"}
        gradientClass="from-[#2563EB] to-[#7C3AED]"
      />

      {/* 2. Control Bar: Filter Tabs & Mark All Read */}
      <div className="bg-white rounded-[16px] border border-[#C7D2FE] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: `सभी (${notifications.length})`, icon: "📋" },
            { id: "live_class", label: "🔴 लाइव कक्षा", icon: "🎙️" },
            { id: "worksheet", label: "📝 अभ्यास पत्रक", icon: "✏️" },
            { id: "quiz", label: "🎮 क्विज़ खेल", icon: "🧠" },
            { id: "feedback", label: "🌟 शिक्षक समीक्षा", icon: "⭐" },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                filter === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                  : "bg-[#EEF2FF] text-slate-700 border-[#C7D2FE] hover:bg-blue-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="bg-[#EEF2FF] hover:bg-blue-100 text-blue-900 border border-[#C7D2FE] px-4 py-1.5 rounded-full text-xs font-black transition self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>✓</span>
            <span>सभी पढ़ा हुआ चिह्नित करें</span>
          </button>
        )}
      </div>

      {/* 3. Notification List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#C7D2FE] p-12 text-center space-y-3">
            <span className="text-4xl">📭</span>
            <h3 className="text-base font-black text-slate-800">
              इस श्रेणी में कोई सूचना नहीं है
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              जब भी शिक्षक नई कक्षा या सामग्री साझा करेंगे, यहाँ तुरंत दिखाई देगी।
            </p>
          </div>
        ) : (
          filtered.map((notif) => {
            const isPlaying = playingAudioId === notif.id;
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-[16px] border p-5 sm:p-6 shadow-sm transition space-y-4 ${
                  !notif.isRead
                    ? "border-blue-400 bg-blue-50/20 ring-1 ring-blue-300"
                    : "border-[#C7D2FE] hover:shadow-md"
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {notif.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full border bg-white text-slate-800 border-[#C7D2FE] shadow-2xs">
                          {notif.badge}
                        </span>
                        {!notif.isRead && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 animate-pulse">
                            🔴 नया अलर्ट
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-semibold">
                          ⏱️ {notif.timestamp}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {notif.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audio Note Container if Feedback type */}
                {notif.audioNote && (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎙️</span>
                        <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                          शिक्षक का वॉयस नोट (Audio Note):
                        </h4>
                      </div>
                      <p className="text-xs text-amber-800 font-medium italic">
                        "{notif.audioNote}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayAudioNote(notif)}
                      className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-2 transition self-start sm:self-auto cursor-pointer ${
                        isPlaying
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-amber-600 hover:bg-amber-700 text-white"
                      }`}
                    >
                      <span>{isPlaying ? "⏸️ रोकें" : "🔊 आवाज़ सुनें"}</span>
                    </button>
                  </div>
                )}

                {/* Bottom Actions Row */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-slate-500">
                    {notif.grade ? `🎒 ${notif.grade}` : "📢 वाणीसेतु नोटिफिकेशन"}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleItemClick(notif)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{notif.ctaText}</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
