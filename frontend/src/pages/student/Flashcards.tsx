import { useState, useEffect } from "react";
import axios from "axios";
import StudentPageBanner from "../../components/StudentPageBanner";

const API = "http://localhost:4000/api";

const TRIBAL_FLASHCARD_UI = {
  san: {
    langLabel: "संथाली (ᱥᱟᱱᱛᱟᱲᱤ)",
    scriptName: "देवनागरी / ओल चिकी",
    badge: "🎴 सचित्र शब्द कार्ड",
    title: "🎴 सचित्र शब्द कार्ड (फ़्लैशकार्ड्स)",
    subtitle: "कार्ड पलटें, अपनी भाषा में शब्द सीखें और सही उच्चारण सुनें।",
    tapToFlip: "पलटने के लिए टैप करें 🔄",
    scriptTitle: "मातृभाषा लिपि (ओल चिकी)",
    pronunciation: "🗣️ उच्चारण:",
    meaningTitle: "अर्थ (हिंदी):",
    listenBtn: "🔊 उच्चारण सुनें",
    prevBtn: "← पिछला कार्ड",
    nextBtn: "अगला कार्ड ➔",
    cardCount: "कार्ड",
    noCards: "इस श्रेणी में कोई कार्ड उपलब्ध नहीं है।",
    loading: "कार्ड लोड हो रहे हैं...",
  },
  ho: {
    langLabel: "हो (ᱦᱳ)",
    scriptName: "वारंग चिती / देवनागरी",
    badge: "🎴 सचित्र शब्द कार्ड",
    title: "🎴 सचित्र शब्द कार्ड (फ़्लैशकार्ड्स)",
    subtitle: "कार्ड पलटें, अपनी भाषा में शब्द सीखें और सही उच्चारण सुनें।",
    tapToFlip: "पलटने के लिए टैप करें 🔄",
    scriptTitle: "मातृभाषा लिपि",
    pronunciation: "🗣️ उच्चारण:",
    meaningTitle: "अर्थ (हिंदी):",
    listenBtn: "🔊 उच्चारण सुनें",
    prevBtn: "← पिछला कार्ड",
    nextBtn: "अगला कार्ड ➔",
    cardCount: "कार्ड",
    noCards: "इस श्रेणी में कोई कार्ड उपलब्ध नहीं है।",
    loading: "कार्ड लोड हो रहे हैं...",
  },
  mun: {
    langLabel: "मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)",
    scriptName: "देवनागरी / मुंडारी लिपि",
    badge: "🎴 सचित्र शब्द कार्ड",
    title: "🎴 सचित्र शब्द कार्ड (फ़्लैशकार्ड्स)",
    subtitle: "कार्ड पलटें, अपनी भाषा में शब्द सीखें और सही उच्चारण सुनें।",
    tapToFlip: "पलटने के लिए टैप करें 🔄",
    scriptTitle: "मातृभाषा लिपि",
    pronunciation: "🗣️ उच्चारण:",
    meaningTitle: "अर्थ (हिंदी):",
    listenBtn: "🔊 उच्चारण सुनें",
    prevBtn: "← पिछला कार्ड",
    nextBtn: "अगला कार्ड ➔",
    cardCount: "कार्ड",
    noCards: "इस श्रेणी में कोई कार्ड उपलब्ध नहीं है।",
    loading: "कार्ड लोड हो रहे हैं...",
  },
};

export default function StudentFlashcards() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("numbers");
  const registeredLang = (localStorage.getItem("preferredLang") as "san" | "ho" | "mun") || "san";
  const [selectedLang, setSelectedLang] = useState<"san" | "ho" | "mun">(registeredLang);
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const t = TRIBAL_FLASHCARD_UI[selectedLang] || TRIBAL_FLASHCARD_UI.san;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDeck();
  }, [selectedCategory, selectedLang]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/flashcards/categories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchDeck = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/flashcards/${selectedCategory}?lang=${selectedLang}`);
      setCards(res.data.deck?.cards || []);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error("Error fetching flashcard deck:", err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text: string) => {
    if (!text || !text.trim()) return;
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.lang = "hi-IN";
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      } else {
        const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
        const audio = new Audio(audioUrl);
        audio.play().catch((e) => console.log("Audio play error:", e));
      }
    } catch (e) {
      console.warn("Speech error:", e);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="p-6 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 */}
      <StudentPageBanner
        icon="🎴"
        title="सचित्र शब्द कार्ड"
        subtitle={t.subtitle}
        tag={t.badge}
        gradientClass="from-[#2563EB] to-[#7C3AED]"
      />

      {/* Language Selection Toolbar */}
      <div className="bg-white p-4 rounded-[16px] border border-[#C7D2FE] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700">मातृभाषा चुनें:</span>
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-2xs">
            {(["san", "ho", "mun"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLang(lang);
                  localStorage.setItem("preferredLang", lang);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedLang === lang
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {lang === "san" ? "संथाली (ᱥᱟᱱᱛᱟᱲᱤ)" : lang === "ho" ? "हो (ᱦᱳ)" : "मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)"}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500">
          {cards.length > 0 ? `कुल ${cards.length} शब्द कार्ड` : "कार्ड लोड हो रहे हैं..."}
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                : "bg-white text-slate-700 border border-[#C7D2FE] hover:bg-blue-50 shadow-2xs"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name.replace(/\s*\(.*?\)/g, '')}</span>
          </button>
        ))}
      </div>

      {/* Interactive Card Player */}
      {loading ? (
        <div className="bg-[#EEF2FF] p-16 rounded-[16px] text-center border border-[#C7D2FE] shadow-2xs">
          <p className="text-slate-600 text-sm font-bold">{t.loading}</p>
        </div>
      ) : currentCard ? (
        <div className="space-y-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer bg-[#EEF2FF] rounded-[16px] p-10 sm:p-14 border-2 border-[#C7D2FE] shadow-md text-center min-h-[340px] flex flex-col items-center justify-center space-y-4 hover:border-blue-400 transition-all transform hover:scale-[1.01] relative"
          >
            <span className="absolute top-4 right-5 text-xs font-bold text-slate-600 bg-white border border-[#C7D2FE] px-3 py-1 rounded-full shadow-2xs">
              {t.tapToFlip}
            </span>

            <div className="text-6xl mb-2 bg-white w-24 h-24 mx-auto rounded-2xl flex items-center justify-center border border-[#C7D2FE] shadow-2xs">
              {currentCard.visualIcon || "🍎"}
            </div>

            {!isFlipped ? (
              // Front: Devanagari script first, then tribal script
              <div className="space-y-2">
                <div className="text-3xl sm:text-4xl font-black text-blue-700 tracking-tight">
                  {currentCard.tribalWordDevanagari || currentCard.phoneticHindi || currentCard.tribalWord}
                </div>
                <div className="text-base font-bold text-slate-700">
                  ({currentCard.tribalWordNative || currentCard.tribalWord || currentCard.nativeScript})
                </div>
                <div className="text-sm font-bold text-slate-500">
                  {t.scriptTitle}
                </div>
              </div>
            ) : (
              // Back: Hindi Meaning & Pronunciation
              <div className="space-y-2 animate-fadeIn">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {currentCard.hindiWord || currentCard.englishWord}
                </div>
                <div className="text-sm font-bold text-slate-600">
                  {t.meaningTitle} {currentCard.hindiWord || currentCard.englishWord}
                </div>
                <div className="text-xs text-blue-800 bg-white border border-[#C7D2FE] px-3 py-1 rounded-full inline-block font-bold shadow-2xs">
                  🗣️ {currentCard.phoneticPronunciation || currentCard.phoneticHindi || currentCard.phonetics}
                </div>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio(currentCard.phoneticHindi || currentCard.tribalWord);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
            >
              <span>🔊</span>
              <span>{t.listenBtn}</span>
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentIndex((prev) => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              disabled={currentIndex === 0}
              className="bg-white border border-[#C7D2FE] hover:bg-blue-50 text-slate-800 font-extrabold text-xs px-5 py-3 rounded-xl shadow-2xs disabled:opacity-40 transition"
            >
              {t.prevBtn}
            </button>

            <span className="text-xs font-extrabold text-slate-600 bg-white px-3 py-1 rounded-lg border border-[#C7D2FE] shadow-2xs">
              {t.cardCount} {currentIndex + 1} / {cards.length}
            </span>

            <button
              onClick={() => {
                setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
                setIsFlipped(false);
              }}
              disabled={currentIndex === cards.length - 1}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md disabled:opacity-40 transition"
            >
              {t.nextBtn}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#EEF2FF] p-12 rounded-[16px] text-center border border-[#C7D2FE] shadow-2xs">
          <p className="text-slate-600 text-sm font-semibold">{t.noCards}</p>
        </div>
      )}
    </div>
  );
}
