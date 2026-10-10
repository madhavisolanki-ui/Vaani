import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:4000/api";

export default function TeacherFlashcards() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("numbers");
  const [targetLang, setTargetLang] = useState("san");
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    handleFetchDeck();
  }, [selectedCategory, targetLang]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/flashcards/categories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching flashcard categories:", err);
    }
  };

  const handleFetchDeck = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/flashcards/deck/${selectedCategory}?lang=${targetLang}`
      );
      setDeck(res.data.deck);
    } catch (err) {
      console.error("Error fetching flashcard deck:", err);
    } finally {
      setLoading(false);
    }
  };

  const playCardAudio = (audioUrl: string, fallbackText?: string) => {
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audio.play().catch(() => {
          if (fallbackText && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(fallbackText);
            utterance.lang = "hi-IN";
            window.speechSynthesis.speak(utterance);
          }
        });
        return;
      } catch (e) {
        console.warn("Audio play error:", e);
      }
    }
    if (fallbackText && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fallbackText);
      utterance.lang = "hi-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 font-sans max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-[#FFFFFF] shadow-xl shadow-blue-900/10 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-xs font-bold text-white px-3 py-1 rounded-full backdrop-blur-md shadow-xs border border-white/20"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                🎯 निपुण भारत विजुअल शिक्षण
              </span>
              <span
                className="text-xs font-bold text-white px-3 py-1 rounded-full backdrop-blur-md shadow-xs border border-white/20"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                🗣️ ध्वन्यात्मक ध्वनि संकेत
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/30 backdrop-blur-md shrink-0"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                🎴
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                विजुअल वोकैबुलरी फ़्लैशकार्ड्स
              </h1>
            </div>

            <p className="text-blue-50/90 text-xs sm:text-sm font-medium leading-relaxed">
              निपुण भारत इंटरएक्टिव शब्दावली फ्लैशकार्ड सेट्स: चित्र, स्थानीय भाषा (ओल चिकी/वारंग चिती) एवं ध्वन्यात्मक उच्चारण।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Filter Section: Clean white card container (#FFFFFF) with shadow */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl shadow-sm border border-[#E2E8F0]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              1. शब्दावली श्रेणी चुनें
            </label>
            <select
              className="w-full border border-[#E2E8F0] p-3.5 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-[#FFFFFF] text-sm font-semibold text-slate-800 transition shadow-2xs cursor-pointer hover:border-slate-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              2. लक्ष्य वर्णलीय भाषा
            </label>
            <select
              className="w-full border border-[#E2E8F0] p-3.5 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-[#FFFFFF] text-sm font-semibold text-slate-800 transition shadow-2xs cursor-pointer hover:border-slate-300"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="san">संथाली (ᱥᱟᱱᱛᱟᱲᱤ - Ol Chiki)</option>
              <option value="ho">हो (ᱦᱳ - Warang Chiti)</option>
              <option value="mun">मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flashcards Grid & FLN Guideline Card */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
          <span className="text-3xl animate-bounce inline-block mb-2">⏳</span>
          <p className="text-sm font-bold text-slate-600">निपुण भारत फ्लैशकार्ड डेक लोड हो रहा है...</p>
        </div>
      ) : deck ? (
        <div className="space-y-6">
          {/* 3. FLN Guideline Card */}
          <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl shadow-sm border border-[#DBEAFE] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-[#2563EB] bg-[#EFF6FF] border border-[#DBEAFE] px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                  🎯 {deck.nipunCompetencyCode || "FLN-N1.1"}
                </span>
                <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                  {deck.nipunDomain || "मौखिक भाषा व संख्या ज्ञान"}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {deck.deckTitle} ({deck.cards?.length} फ़्लैशकार्ड्स)
              </h2>
              {deck.pedagogicalTeacherTip && (
                <p className="text-xs text-slate-700 font-medium">
                  💡 <strong className="text-slate-900 font-bold">शिक्षक शिक्षण निर्देश:</strong> {deck.pedagogicalTeacherTip}
                </p>
              )}
            </div>

            {/* Prominent Audio Action Button */}
            <button
              type="button"
              className="text-xs font-black px-4 py-2.5 rounded-full border border-blue-200 shadow-xs shrink-0 flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer bg-[#EFF6FF] text-[#2563EB]"
            >
              <span>🔊</span>
              <span>सुनने के लिए ऑडियो पर क्लिक करें</span>
            </button>
          </div>

          {/* 4. Flashcards Grid: Light Blue Cards (#EFF6FF) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deck.cards?.map((card: any, idx: number) => {
              return (
                <div
                  key={card.id || idx}
                  className="rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-[#DBEAFE] bg-[#EFF6FF] flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Visual Icon / Illustration Box */}
                    <div className="w-24 h-24 mx-auto my-2 rounded-2xl bg-white shadow-sm flex items-center justify-center text-5xl border border-[#DBEAFE] group-hover:scale-105 transition duration-200">
                      {card.icon}
                    </div>

                    {/* Vernacular Bilingual Word (Ol Chiki / Native Script & Devanagari) */}
                    <div
                      className="p-4 rounded-2xl bg-white border border-[#DBEAFE] text-center my-3 shadow-xs space-y-1"
                    >
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#2563EB]">
                        {deck.targetLangName}:
                      </p>
                      <p className="text-2xl font-black text-slate-900 tracking-wide font-sans">
                        {card.tribalWordNative}
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        ({card.tribalWordDevanagari})
                      </p>
                      <p className="text-[11px] font-extrabold text-[#4F46E5] pt-1">
                        🗣️ {card.phoneticPronunciation}
                      </p>
                    </div>
                  </div>

                  {/* Tap-to-listen Speaker CTA Icon */}
                  <button
                    onClick={() => playCardAudio(card.audioUrl, `${card.tribalWordDevanagari}`)}
                    className="w-full bg-white hover:bg-[#2563EB] hover:text-white text-[#1E3A8A] py-3 rounded-xl font-black text-xs shadow-xs border border-[#DBEAFE] flex items-center justify-center gap-2 transition duration-200 active:scale-95 cursor-pointer mt-2"
                  >
                    <span className="text-base">🔊</span>
                    <span>ऑडियो सुनें</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}