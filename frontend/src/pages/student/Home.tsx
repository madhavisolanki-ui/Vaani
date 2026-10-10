import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000/api";

interface FolkStory {
  id: string;
  title: string;
  tribalSubtitle: string;
  moral: string;
  content: string;
  icon: string;
  duration: string;
}

const FOLK_STORIES: FolkStory[] = [
  {
    id: "story-1",
    title: "करम और धरम की लोककथा",
    tribalSubtitle: "ᱥᱟᱱᱛᱟᱲᱤ / ᱢᱩᱱᱰᱟᱨᱤ ᱥᱮᱨᱣᱟ ᱠᱟᱹᱦᱱᱤ",
    moral: "पेड़-पौधे और प्रकृति ही हमारा सबसे बड़ा धन हैं।",
    content: "बहुत समय पहले की बात है, करम और धरम नाम के दो भाई थे। करम बहुत परिश्रमी था और प्रकृति तथा खेतों की देखभाल करता था। एक दिन गांव में सूखा पड़ा तो करम ने पवित्र करम पेड़ की पूजा की और जल संरक्षण किया। उसकी भक्ति और मेहनत से हरियाली लौट आई और सारा गांव खुशहाल हो गया।",
    icon: "🌳",
    duration: "2 मिनट",
  },
  {
    id: "story-2",
    title: "चालाक खरगोश और शेर",
    tribalSubtitle: "ᱦᱳ ᱠᱟᱹᱡᱤ ᱠᱟᱹᱦᱱᱤ • ಬುದ್ಧಿವಂತ ಮೊಲ",
    moral: "ताकत से बड़ी बुद्धि होती है।",
    content: "एक घने जंगल में एक घमंडी शेर रहता था जो रोज एक जानवर को खाता था। एक दिन छोटे खरगोश की बारी आई। खरगोश ने अपनी चतुराई से शेर को कुएं में उसकी ही परछाई दिखाकर कुएं में कुदवा दिया। इस तरह नन्हे खरगोश ने जंगल के सभी पशुओं की जान बचा ली।",
    icon: "🐇",
    duration: "2.5 मिनट",
  },
  {
    id: "story-3",
    title: "नन्ही चिड़िया और जामुन का पेड़",
    tribalSubtitle: "ᱫᱟᱨᱮ ᱟᱨ ᱪᱮᱬᱮ ᱠᱟᱹᱦᱱᱤ",
    moral: "आपसी सहयोग और बांटकर खाने से खुशियां बढ़ती हैं।",
    content: "एक नन्ही चिड़िया जामुन के पेड़ पर घोंसला बनाकर रहती थी। वह हर सुबह मीठे जामुन तोड़कर नीचे गिलहरी और चींटियों को भी देती थी। जब तूफान आया तो पेड़ की घनी डालियों ने चिड़िया के घोंसले को सुरक्षित रखा। प्रकृति में सब एक-दूसरे की मदद करते हैं।",
    icon: "🐦",
    duration: "1.5 मिनट",
  },
];

export interface StudentFeatureTool {
  id: string;
  title: string;
  icon: string;
  to: string;
  desc: string;
  actionText: string;
  badge?: string;
}

export const ALL_STUDENT_FEATURES: StudentFeatureTool[] = [
  {
    id: "live-class",
    title: "लाइव कक्षा",
    icon: "🎙️",
    to: "/live-class",
    desc: "शिक्षक के साथ वास्तविक समय अनुवादित कक्षा",
    actionText: "कक्षा में जुड़ें",
    badge: "🔴 लाइव",
  },
  {
    id: "worksheets",
    title: "अभ्यास पत्रक",
    icon: "📝",
    to: "/worksheets",
    desc: "मातृभाषा में वर्कशीट, चित्र बनाएं या वॉयस नोट भेजें",
    actionText: "वर्कशीट हल करें",
    badge: "नया",
  },
  {
    id: "quiz",
    title: "क्विज़ व मूल्यांकन",
    icon: "🎯",
    to: "/quiz",
    desc: "सचित्र बहुविकल्पीय क्विज़ खेलें और सितारे जीतें",
    actionText: "क्विज़ शुरू करें",
    badge: "⭐ सितारे",
  },
  {
    id: "flashcards",
    title: "सचित्र शब्द कार्ड",
    icon: "🎴",
    to: "/flashcards",
    desc: "कार्ड पलटें, अपनी भाषा में शब्द सीखें व उच्चारण सुनें",
    actionText: "शब्द कार्ड देखें",
  },
  {
    id: "drawing-canvas",
    title: "चित्रकला व रंग भरो",
    icon: "🎨",
    to: "/drawing-canvas",
    desc: "डिजिटल कैनवास पर चित्र बनाएं और रंग भरें",
    actionText: "कैनवास खोलें",
  },
  {
    id: "audio-library",
    title: "कहानियाँ",
    icon: "🎧",
    to: "/audio-library",
    desc: "मातृभाषा व हिंदी में लोककथाएँ और बालगीत सुनें",
    actionText: "कहानियाँ सुनें",
  },
  {
    id: "profile",
    title: "मेरी प्रोफ़ाइल",
    icon: "👤",
    to: "/profile",
    desc: "विद्यार्थी पहचान पत्र, पदक और कुल अर्जित सितारे",
    actionText: "प्रोफ़ाइल देखें",
  },
  {
    id: "notifications",
    title: "सूचनाएं व अलर्ट्स",
    icon: "🔔",
    to: "/notifications",
    desc: "लाइव कक्षा, वर्कशीट, क्विज़ और शिक्षक समीक्षा संदेश",
    actionText: "सूचनाएं देखें",
    badge: "अपडेट्स",
  },
  {
    id: "settings",
    title: "सेटिंग्स",
    icon: "⚙️",
    to: "/settings",
    desc: "पसंदीदा मातृभाषा और आवाज़ की गति निर्धारित करें",
    actionText: "सेटिंग्स खोलें",
  },
];

export default function StudentHome() {
  const studentName = localStorage.getItem("userName") || "विद्यार्थी";
  const registeredLang = (localStorage.getItem("preferredLang") as "san" | "ho" | "mun") || "mun";
  const studentGrade = localStorage.getItem("studentGrade") || "कक्षा 1";
  const [selectedLang, setSelectedLang] = useState<"san" | "ho" | "mun">(registeredLang);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [practicePapers, setPracticePapers] = useState<any[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Student Earned Stars (Default 24 stars as requested, or updated from reviews)
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem("studentStars");
    return saved ? Number(saved) : 24;
  });

  // Modals for Sidebar Tools & Core Activities
  const [searchParams] = useSearchParams();
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);

  useEffect(() => {
    const tool = searchParams.get("tool");
    if (tool === "drawing") {
      setIsDrawingOpen(true);
      setIsStoriesOpen(false);
      setIsProfileOpen(false);
      setIsSettingsOpen(false);
    } else if (tool === "stories") {
      setIsStoriesOpen(true);
      setIsDrawingOpen(false);
      setIsProfileOpen(false);
      setIsSettingsOpen(false);
    } else if (tool === "profile") {
      setIsProfileOpen(true);
      setIsDrawingOpen(false);
      setIsStoriesOpen(false);
      setIsSettingsOpen(false);
    } else if (tool === "settings") {
      setIsSettingsOpen(true);
      setIsDrawingOpen(false);
      setIsStoriesOpen(false);
      setIsProfileOpen(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const savedStars = localStorage.getItem("studentStars");
    if (savedStars && Number(savedStars) !== stars) {
      setStars(Number(savedStars));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studentStars", String(stars));
  }, [stars]);

  useEffect(() => {
    fetchData();
  }, [selectedLang, studentGrade]);

  const fetchData = async () => {
    try {
      const [classRes, paperRes] = await Promise.all([
        axios.get(`${API}/curriculum/classes`).catch(() => ({ data: { classes: [] } })),
        axios.get(`${API}/curriculum/practice-papers?grade=${encodeURIComponent(studentGrade)}`).catch(() => ({ data: { papers: [] } })),
      ]);

      const allCls = classRes.data.classes || [];
      const isGrd1 = studentGrade.includes("1");
      const isGrd2 = studentGrade.includes("2");

      const filteredCls = allCls.filter((c: any) => {
        const cGrd = (c.grade || "").toLowerCase();
        if (isGrd1) return cGrd.includes("1") || cGrd.includes("कक्षा 1");
        if (isGrd2) return cGrd.includes("2") || cGrd.includes("कक्षा 2");
        return cGrd.includes(studentGrade.toLowerCase());
      });

      setTodayClasses(filteredCls.length > 0 ? filteredCls : allCls);
      setPracticePapers(paperRes.data.papers || []);
    } catch (err) {
      console.error("Error fetching student dashboard data:", err);
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

  const handleStoryPlay = (story: FolkStory) => {
    if (playingStoryId === story.id) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setPlayingStoryId(null);
    } else {
      setPlayingStoryId(story.id);
      playAudio(story.title + "। " + story.content);
    }
  };

  // Main featured class (scheduled by teacher or default high-fidelity class)
  const mainClass = todayClasses.length > 0 ? todayClasses[0] : {
    id: "cls_live_default",
    topic: "गणित: 1 से 10 तक संख्या ज्ञान एवं सचित्र गिनती",
    subject: "गणित (संख्या बोध)",
    grade: studentGrade,
    teacherName: "माधवी मुर्मू (सहायक शिक्षक)",
    startTime: "10:30 AM",
    endTime: "11:15 AM",
    status: "live",
    roomCode: "MAT-101",
  };

  // Default upcoming quizzes if API list is empty
  const upcomingQuizzes = practicePapers.length > 0 ? practicePapers : [
    {
      id: "quiz-1",
      title: "गणित: 1 से 10 गिनती एवं संख्या पहचान",
      subject: "गणित",
      grade: "कक्षा 1",
      durationMinutes: 15,
      totalMarks: 10,
      instructionsHindi: "चित्र देखकर सही संख्या चुनें और सितारे जीतें।",
      questions: [
        {
          qNum: 1,
          questionHindi: "चित्र में कितने सेब हैं? 🍎 🍎 🍎",
          marks: 2,
          options: ["2 (दो)", "3 (तीन)", "4 (चार)", "5 (पाँच)"],
          correctAnswer: "3",
        },
        {
          qNum: 2,
          questionHindi: "संख्या '५' (5) के ठीक बाद कौन सी संख्या आती है?",
          marks: 2,
          options: ["4 (चार)", "6 (छह)", "7 (सात)", "3 (तीन)"],
          correctAnswer: "6",
        },
        {
          qNum: 3,
          questionHindi: "हाथ में कितनी उंगलियां होती हैं? 🖐️",
          marks: 2,
          options: ["3 (तीन)", "4 (चार)", "5 (पाँच)", "6 (छह)"],
          correctAnswer: "5",
        },
      ],
    },
    {
      id: "quiz-2",
      title: "भाषा: पशु-पक्षी एवं दैनिक शब्द परख",
      subject: "भाषा व साक्षरता",
      grade: "कक्षा 1",
      durationMinutes: 10,
      totalMarks: 8,
      instructionsHindi: "चित्र पहचानकर सही शब्द का चयन करें।",
      questions: [
        {
          qNum: 1,
          questionHindi: "गाय 🐄 को मुंडारी/संथाली में क्या कहते हैं?",
          marks: 2,
          options: ["गाई (ᱜᱟᱹᱭ)", "सिम (ᱥᱤᱢ)", "सेता (ᱥᱮᱛᱟ)", "सुकरु"],
          correctAnswer: "गाई",
        },
        {
          qNum: 2,
          questionHindi: "पक्षी 🐦 को हिंदी में क्या कहते हैं?",
          marks: 2,
          options: ["चिड़िया", "बिल्ली", "घोड़ा", "हाथी"],
          correctAnswer: "चिड़िया",
        },
      ],
    },
    {
      id: "quiz-3",
      title: "रंग व पर्यावरण पहचान अभ्यास",
      subject: "पर्यावरण अध्ययन",
      grade: "कक्षा 1",
      durationMinutes: 12,
      totalMarks: 10,
      instructionsHindi: "प्रकृति और रंगों से जुड़े प्रश्नों के उत्तर दें।",
      questions: [
        {
          qNum: 1,
          questionHindi: "पेड़ की पत्तियों का रंग कैसा होता है? 🍃",
          marks: 2,
          options: ["हरा", "लाल", "नीला", "पीला"],
          correctAnswer: "हरा",
        },
        {
          qNum: 2,
          questionHindi: "सूरज का रंग कैसा होता है? ☀️",
          marks: 2,
          options: ["पीला/सुनहरा", "काला", "बैंगनी", "गुलाबी"],
          correctAnswer: "पीला/सुनहरा",
        },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-7 bg-[#F8FAFC] min-h-full space-y-7 max-w-6xl mx-auto font-sans">
      {/* =========================================================================
          1. मुख्य स्वागत बैनर (Student Main Welcome Banner)
             (Banner Color Specs: Royal Blue to Violet #2563EB to #7C3AED with Pure White)
         ========================================================================= */}
      <div
        className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-3xl p-6 sm:p-8 text-[#FFFFFF] shadow-xl shadow-blue-900/15 relative overflow-hidden"
        style={{ background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)" }}
      >
        {/* Background decorative soft shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* 3 Prominent Header Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Badge 1: कक्षा टैग */}
              <span
                className="text-[#FFFFFF] text-xs font-black px-3.5 py-1.5 rounded-full border border-white/30 backdrop-blur-xs flex items-center gap-1.5 shadow-2xs"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              >
                {studentGrade}
              </span>

              {/* Badge 2: मातृभाषा */}
              <span
                className="text-[#FFFFFF] text-xs font-black px-3.5 py-1.5 rounded-full border border-white/30 backdrop-blur-xs flex items-center gap-1.5 shadow-2xs"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              >
                🌐 {selectedLang === "mun" ? "मुंडारी" : selectedLang === "san" ? "संथाली" : "हो"}
              </span>

              {/* Badge 3: अर्जित स्टार्स */}
              <span className="bg-white text-indigo-700 text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                ⭐ {stars}
              </span>
            </div>

            {/* Welcome Greeting Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-2.5 text-[#FFFFFF]">
                <span>स्वागत है,</span>
                <span className="text-yellow-300">{studentName}!</span>
                <span>👋</span>
              </h1>
              <p className="text-white/95 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
                आज की पढ़ाई, लाइव कक्षा, अभ्यास पत्रक और सचित्र शब्द कार्ड यहाँ एक ही जगह उपलब्ध हैं।
              </p>
            </div>
          </div>

          {/* Language Switcher Badge for Multilingual Support */}
          <div
            className="p-3.5 rounded-2xl border border-white/25 space-y-2 shrink-0 backdrop-blur-xs"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-white">
              मातृभाषा चुनें:
            </p>
            <div className="flex items-center gap-1.5 bg-black/15 p-1.5 rounded-xl">
              {(["mun", "san", "ho"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    localStorage.setItem("preferredLang", lang);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedLang === lang
                      ? "bg-white text-[#2563EB] shadow-sm font-black"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {lang === "mun" ? "मुंडारी" : lang === "san" ? "संथाली" : "हो"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          1.5 रियल-टाइम अपडेट्स एवं सूचनाएं (Student Real-time Notification System)
         ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              ताज़ा सूचनाएं व रियल-टाइम अलर्ट्स
            </h2>
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
              🔴 4 नए अपडेट
            </span>
          </div>
          <Link
            to="/notifications"
            className="text-xs font-black text-[#2563EB] hover:text-indigo-700 underline"
          >
            सभी सूचनाएं देखें ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Live Class Alert */}
          <div className="bg-white p-4.5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  🔴 लाइव कक्षा
                </span>
                <span className="text-[10px] font-bold text-slate-500">2 मिनट पहले</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                नई लाइव कक्षा शेड्यूल्ड हुई है
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                शिक्षक माधवी मुर्मू जी द्वारा 'गिनती 1 से 10' पर लाइव कक्षा शुरू हो चुकी है।
              </p>
            </div>
            <Link
              to="/live-class"
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <span>🎙️ लाइव कक्षा में जुड़ें</span>
              <span>➔</span>
            </Link>
          </div>

          {/* Card 2: Worksheet Alert */}
          <div className="bg-white p-4.5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2563EB] border border-blue-200">
                  📝 नया अभ्यास
                </span>
                <span className="text-[10px] font-bold text-slate-500">15 मिनट पहले</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                शिक्षक ने नया अभ्यास पत्रक दिया है
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                कक्षा 1: मुंडारी व हिंदी भाषा अभ्यास पत्रक (गिनती व चित्र मिलान) हल करें।
              </p>
            </div>
            <Link
              to="/worksheets"
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <span>✏️ अभ्यास पत्रक हल करें</span>
              <span>➔</span>
            </Link>
          </div>

          {/* Card 3: Quiz Alert */}
          <div className="bg-white p-4.5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  🎮 नया खेल क्विज़
                </span>
                <span className="text-[10px] font-bold text-slate-500">1 घंटा पहले</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                नया क्विज़/खेल उपलब्ध है
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                संख्या बोध और रंग पहचान पर नया सचित्र ऑडियो क्विज़ खेलकर सितारे जीतें।
              </p>
            </div>
            <Link
              to="/quiz"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <span>🧠 क्विज़ खेलें</span>
              <span>➔</span>
            </Link>
          </div>

          {/* Card 4: Teacher Feedback Alert with Audio */}
          <div className="bg-white p-4.5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  🌟 शिक्षक समीक्षा
                </span>
                <span className="text-[10px] font-bold text-slate-500">30 मिनट पहले</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                आपकी वर्कशीट जाँच ली गई है! ⭐ 5/5 मिले
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                शिक्षक ने आपके चित्र व उत्तर की प्रशंसा की और ऑडियो टिप्पणी भेजी।
              </p>
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  if ("speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    const utt = new SpeechSynthesisUtterance("शाबाश सिदो! तुमने मुंडारी और हिंदी में सभी प्रश्नों के बहुत सुंदर और सही उत्तर लिखे हैं। ऐसे ही मन लगाकर पढ़ाई करो!");
                    utt.lang = "hi-IN";
                    utt.rate = 0.9;
                    window.speechSynthesis.speak(utt);
                  }
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
              >
                <span>🔊 शिक्षक की आवाज़ सुनें</span>
              </button>
              <Link
                to="/worksheets"
                className="w-full bg-white hover:bg-blue-50 text-[#2563EB] border border-blue-200 font-black text-xs py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 shadow-2xs transition"
              >
                <span>⭐ स्कोरकार्ड देखें</span>
                <span>➔</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. ठीक नीचे विषयवार प्रगति संक्षेप (गणित, भाषा, चित्रकला, लोककथाओं की पूर्ण कक्षाएं)
         ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              विषयवार प्रगति संक्षेप
            </h2>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-[#2563EB] border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
            {studentGrade} शिक्षण सत्र
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. गणित */}
          <div className="bg-white p-5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl p-2 bg-blue-50 rounded-xl border border-blue-200 shadow-2xs">🔢</span>
              <span className="bg-blue-50 text-[#2563EB] text-[11px] font-black px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                80% पूर्ण
              </span>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">गणित</h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">संख्या ज्ञान एवं गिनती</p>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-blue-100">
                <div className="bg-gradient-to-r from-[#2563EB] to-indigo-500 h-full rounded-full" style={{ width: "80%" }}></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 pt-0.5">
                <span>8 / 10 कक्षाएं पूर्ण</span>
                <span className="text-amber-700 font-black">⭐ 24</span>
              </div>
            </div>
          </div>

          {/* 2. भाषा */}
          <div className="bg-white p-5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl p-2 bg-blue-50 rounded-xl border border-blue-200 shadow-2xs">📖</span>
              <span className="bg-emerald-50 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                70% पूर्ण
              </span>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">भाषा</h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">मातृभाषा एवं हिंदी साक्षरता</p>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-blue-100">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: "70%" }}></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 pt-0.5">
                <span>7 / 10 कक्षाएं पूर्ण</span>
                <span className="text-amber-700 font-black">⭐ 20</span>
              </div>
            </div>
          </div>

          {/* 3. चित्रकला */}
          <div className="bg-white p-5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl p-2 bg-purple-50 rounded-xl border border-purple-200 shadow-2xs">🎨</span>
              <span className="bg-purple-50 text-purple-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                83% पूर्ण
              </span>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">चित्रकला</h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">रंग पहचान व रचनात्मक कला</p>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-purple-100">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{ width: "83%" }}></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 pt-0.5">
                <span>5 / 6 कक्षाएं पूर्ण</span>
                <span className="text-amber-700 font-black">⭐ 16</span>
              </div>
            </div>
          </div>

          {/* 4. लोककथाएँ */}
          <div className="bg-white p-5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl p-2 bg-amber-50 rounded-xl border border-amber-200 shadow-2xs">📜</span>
              <span className="bg-amber-50 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                75% पूर्ण
              </span>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">लोककथाएँ</h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">मौखिक परंपरा व ज्ञान</p>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-amber-100">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 pt-0.5">
                <span>6 / 8 कक्षाएं पूर्ण</span>
                <span className="text-amber-700 font-black">⭐ 18</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. शिक्षक द्वारा शेड्यूल की गई आज की लाइव कक्षा का मुख्य कार्ड सीधे
             🎙️ लाइव कक्षा में जुड़ें ➔ बटन के साथ
         ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎙️</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              आज की लाइव कक्षा
            </h2>
          </div>
          <span className="text-xs font-black bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-1.5 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            लाइव ब्रॉडकास्ट
          </span>
        </div>

        {/* Featured Live Class Main Card with Royal Blue to Violet gradient */}
        <div
          className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] p-6 sm:p-7 rounded-3xl border border-indigo-400 shadow-xl shadow-blue-900/15 hover:shadow-2xl transition space-y-5 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)" }}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3.5 py-1 rounded-full border border-white/25 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                🔴 अभी लाइव कक्षा जारी है
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full border border-white/25">
                ⏰ {mainClass.startTime} - {mainClass.endTime}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/25">
                {mainClass.grade}
              </span>
            </div>

            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/25">
              कक्ष कोड: {mainClass.roomCode || "MAT-101"}
            </span>
          </div>

          <div className="space-y-1.5 relative z-10">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {mainClass.topic}
            </h3>
            <p className="text-xs sm:text-sm text-white/95 font-semibold flex items-center gap-2">
              <span>विषय: <strong>{mainClass.subject}</strong></span>
              <span>•</span>
              <span>शिक्षक: <strong>{mainClass.teacherName || "माधवी मुर्मू (शिक्षक)"}</strong></span>
            </p>
          </div>

          {/* Direct Join Button */}
          <div className="pt-1 relative z-10">
            <Link
              to="/live-class"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-blue-50 text-[#2563EB] px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-xl transition transform active:scale-95 cursor-pointer"
            >
              <span className="text-lg">🎙️</span>
              <span>लाइव कक्षा में जुड़ें ➔</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. आने वाले आगामी क्विज़ के कार्ड्स (Upcoming Quizzes Cards)
         ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              आने वाले आगामी क्विज़
            </h2>
          </div>
          <Link
            to="/quiz"
            className="text-xs font-black text-[#2563EB] hover:text-indigo-700 underline"
          >
            सभी क्विज़ देखें ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingQuizzes.slice(0, 3).map((quiz: any, idx: number) => (
            <div
              key={quiz.id || idx}
              className="bg-white p-5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-50 text-[#2563EB] text-[11px] font-black px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                    {quiz.grade || "कक्षा 1"} • {quiz.subject || "गणित"}
                  </span>
                  <span className="bg-amber-50 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                    ⭐ {quiz.totalMarks || 10} अंक
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    ⏱️ अवधि: {quiz.durationMinutes || 15} मिनट
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-2xs text-[11px] text-slate-700">
                  <span className="font-bold text-slate-800">निर्देश: </span>
                  {quiz.instructionsHindi || "प्रश्नों को ध्यान से पढ़कर सही उत्तर चुनें।"}
                </div>
              </div>

              <Link
                to="/quiz"
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>✏️</span>
                <span>क्विज़ हल करें</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. मुख्य अध्ययन टूल्स (क्विक एक्सेस ग्रिड) - 5 प्राथमिक + 6वां 'और देखें' (More)
         ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span>मुख्य अध्ययन टूल्स (क्विक एक्सेस ग्रिड)</span>
            </h2>
            <span className="bg-blue-100 text-[#2563EB] text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
              {showAllFeatures ? "सभी 9 सुविधाएं" : "प्राथमिक 5 सुविधाएं"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="text-xs font-black text-[#2563EB] bg-white hover:bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 transition flex items-center gap-1.5 active:scale-95 shadow-2xs cursor-pointer"
          >
            <span>{showAllFeatures ? "▲ कम दिखाएं (5 सुविधाएं)" : "▼ और देखें (सभी 9 सुविधाएं)"}</span>
          </button>
        </div>

        {/* 6-Column Grid Layout matching Teacher Dashboard 5 + More Pattern */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {!showAllFeatures ? (
            /* Collapsed: First 5 Features + 6th 'बाकी फ़ीचर्स देखें' Card */
            <>
              {ALL_STUDENT_FEATURES.slice(0, 5).map((feat) => (
                <Link
                  key={feat.id}
                  to={feat.to}
                  className="group bg-white hover:bg-blue-50/40 p-5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-lg transition-all duration-200 space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-md flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition duration-200">
                        {feat.icon}
                      </div>
                      {feat.badge && (
                        <span className="bg-blue-100 text-[#2563EB] text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200">
                          {feat.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 group-hover:text-[#2563EB] transition leading-snug">
                        {feat.title}
                      </h3>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#2563EB] group-hover:translate-x-1 transition">
                    <span>{feat.actionText}</span>
                    <span>➔</span>
                  </div>
                </Link>
              ))}

              {/* 6th Card: More Button Card */}
              <button
                type="button"
                onClick={() => setShowAllFeatures(true)}
                className="group bg-blue-50/70 hover:bg-blue-100/80 p-5 rounded-2xl border-2 border-dashed border-blue-300 hover:border-[#2563EB] shadow-2xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between text-left active:scale-95 cursor-pointer"
                title="बाकी सभी सुविधाएं देखें"
              >
                <div className="space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-md flex items-center justify-center text-2xl font-black group-hover:scale-110 transition">
                    ➕
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-[#2563EB] transition leading-snug">
                      बाकी फ़ीचर्स देखें
                    </h3>
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-200/80 text-xs font-black text-[#2563EB] flex items-center gap-1 group-hover:translate-x-1 transition">
                  <span>और 4 सुविधाएं खोलें</span>
                  <span>➔</span>
                </div>
              </button>
            </>
          ) : (
            /* Expanded: All 9 Features + 10th 'कम दिखाएं' Card */
            <>
              {ALL_STUDENT_FEATURES.map((feat) => (
                <Link
                  key={feat.id}
                  to={feat.to}
                  className="group bg-white hover:bg-blue-50/40 p-5 rounded-2xl border border-[#C7D2FE] hover:border-[#2563EB] shadow-2xs hover:shadow-lg transition-all duration-200 space-y-3.5 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-md flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition duration-200">
                        {feat.icon}
                      </div>
                      {feat.badge && (
                        <span className="bg-blue-100 text-[#2563EB] text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200">
                          {feat.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 group-hover:text-[#2563EB] transition leading-snug">
                        {feat.title}
                      </h3>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#2563EB] group-hover:translate-x-1 transition">
                    <span>{feat.actionText}</span>
                    <span>➔</span>
                  </div>
                </Link>
              ))}

              {/* 10th Card: Show Less Button Card */}
              <button
                type="button"
                onClick={() => setShowAllFeatures(false)}
                className="group bg-slate-50 hover:bg-slate-100/90 p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-500 shadow-2xs transition-all space-y-3.5 flex flex-col justify-between text-left active:scale-95 cursor-pointer animate-in fade-in"
                title="कम सुविधाएं दिखाएं"
              >
                <div className="space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-700 text-white shadow-md flex items-center justify-center text-2xl font-black group-hover:scale-110 transition">
                    ▲
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-slate-700 transition leading-snug">
                      कम दिखाएं
                    </h3>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs font-black text-slate-600 flex items-center gap-1 group-hover:-translate-y-0.5 transition">
                  <span>संक्षिप्त करें</span>
                  <span>▲</span>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: DRAWING CANVAS (चित्रकला व रंग भरो)
         ========================================================================= */}
      {isDrawingOpen && (
        <DrawingCanvasModal onClose={() => setIsDrawingOpen(false)} />
      )}

      {/* =========================================================================
          MODAL 2: AUDIO FOLK STORIES (ऑडियो कहानियाँ)
         ========================================================================= */}
      {isStoriesOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-[#EEF2FF] rounded-2xl border border-[#C7D2FE]">📻</span>
                <div>
                  <h3 className="text-xl font-black text-slate-900">ऑडियो लोककथाएँ एवं बालगीत</h3>
                  <p className="text-xs text-slate-500 font-medium">मातृभाषा व हिंदी में प्रेरणादायक कहानियाँ सुनें</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                  setPlayingStoryId(null);
                  setIsStoriesOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {FOLK_STORIES.map((story) => {
                const isPlaying = playingStoryId === story.id;
                return (
                  <div
                    key={story.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPlaying
                        ? "bg-[#EEF2FF] border-blue-400 ring-2 ring-blue-300"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{story.icon}</span>
                          <h4 className="text-base font-black text-slate-900">{story.title}</h4>
                          <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                            ⏱️ {story.duration}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-blue-700">{story.tribalSubtitle}</p>
                        <p className="text-xs text-slate-700 leading-relaxed pt-1">{story.content}</p>
                        <div className="pt-1.5 text-[11px] font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                          💡 सीख: {story.moral}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        onClick={() => handleStoryPlay(story)}
                        className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition ${
                          isPlaying
                            ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <span>{isPlaying ? "⏹️" : "🔊"}</span>
                        <span>{isPlaying ? "कहानी रोकें" : "कहानी सुनें"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                  setPlayingStoryId(null);
                  setIsStoriesOpen(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: INTERACTIVE QUIZ SOLVING
         ========================================================================= */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="bg-[#EEF2FF] text-blue-800 text-[11px] font-black px-3 py-0.5 rounded-full border border-[#C7D2FE]">
                  वाणीसेतु • इंटरएक्टिव अभ्यास
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{selectedPaper.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {selectedPaper.questions?.map((q: any, i: number) => (
                <div key={i} className="p-5 rounded-2xl border border-[#C7D2FE] space-y-3 bg-[#EEF2FF]">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-blue-700">प्रश्न {q.qNum || i + 1} ({q.marks || 2} अंक)</span>
                    <button
                      onClick={() => playAudio(q.questionHindi)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#C7D2FE] shadow-2xs"
                    >
                      🔊 सुनें
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-900">{q.questionHindi}</p>

                  {q.options && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {q.options.map((opt: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setStars((s) => s + 2);
                            alert("🌟 बहुत बढ़िया! सही उत्तर (+2 सितारे)");
                          }}
                          className="p-3 border border-[#C7D2FE] rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-blue-600 hover:text-white transition active:scale-95 text-left cursor-pointer shadow-2xs"
                        >
                          ({String.fromCharCode(65 + optIdx)}) {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setStars((s) => s + 4);
                  alert("🎉 शाबाश! आपने यह अभ्यास पत्रक पूरा कर लिया (+4 सितारे)!");
                  setSelectedPaper(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>✓</span>
                <span>उत्तर जमा करें</span>
              </button>
              <button
                onClick={() => setSelectedPaper(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: 👤 7. मेरी प्रोफ़ाइल (PROFILE MODAL)
         ========================================================================= */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#EEF2FF] rounded-[16px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#C7D2FE] space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#C7D2FE] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl border border-[#C7D2FE] flex items-center justify-center text-2xl shadow-2xs">
                  🎓
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">👤 मेरी प्रोफ़ाइल</h3>
                  <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-[#C7D2FE]">
                    विद्यार्थी पहचान पत्र
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Profile Info Cards */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#C7D2FE] shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">विद्यार्थी का नाम:</span>
                <span className="text-sm font-black text-slate-900">{studentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">कक्षा:</span>
                <span className="text-xs font-black text-blue-700 bg-[#EEF2FF] px-2.5 py-0.5 rounded-md border border-[#C7D2FE]">
                  {studentGrade}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">मातृभाषा:</span>
                <span className="text-xs font-bold text-slate-800">
                  {selectedLang === "mun" ? "मुंडारी (Devanagari / Mundari)" : selectedLang === "san" ? "संथाली (Ol Chiki)" : "हो (Warang Citi)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">विद्यालय:</span>
                <span className="text-xs font-bold text-slate-800">
                  {localStorage.getItem("userSchool") || "राजकीय प्राथमिक विद्यालय"}
                </span>
              </div>
            </div>

            {/* Badges and Stars Section */}
            <div className="bg-white p-5 rounded-2xl border border-[#C7D2FE] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  ⭐ अर्जित सितारे व उपलब्धियां:
                </h4>
                <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                  ⭐ {stars} कुल सितारे
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                <div className="bg-[#EEF2FF] p-2.5 rounded-xl border border-[#C7D2FE] flex items-center gap-2">
                  <span>🌟</span>
                  <span>नियमित उपस्थिति</span>
                </div>
                <div className="bg-[#EEF2FF] p-2.5 rounded-xl border border-[#C7D2FE] flex items-center gap-2">
                  <span>🎨</span>
                  <span>कला प्रवीण</span>
                </div>
                <div className="bg-[#EEF2FF] p-2.5 rounded-xl border border-[#C7D2FE] flex items-center gap-2">
                  <span>📖</span>
                  <span>कहानी प्रेमी</span>
                </div>
                <div className="bg-[#EEF2FF] p-2.5 rounded-xl border border-[#C7D2FE] flex items-center gap-2">
                  <span>🔢</span>
                  <span>संख्या मित्र</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                ठीक है (बंद करें)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: ⚙️ 8. सेटिंग्स (SETTINGS MODAL)
         ========================================================================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#EEF2FF] rounded-[16px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#C7D2FE] space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#C7D2FE] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl border border-[#C7D2FE] flex items-center justify-center text-2xl shadow-2xs">
                  ⚙️
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">⚙️ सेटिंग्स</h3>
                  <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-[#C7D2FE]">
                    अध्ययन प्राथमिकताएं
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Language Selection Setting */}
            <div className="bg-white p-5 rounded-2xl border border-[#C7D2FE] shadow-2xs space-y-3">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                १. अपनी पसंदीदा मातृभाषा चुनें:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "mun", label: "मुंडारी (Devanagari)" },
                    { id: "san", label: "संथाली (Ol Chiki)" },
                    { id: "ho", label: "हो (Warang Citi)" },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setSelectedLang(lang.id);
                      localStorage.setItem("preferredLang", lang.id);
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-black border transition ${
                      selectedLang === lang.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-[#EEF2FF] text-slate-800 border-[#C7D2FE] hover:bg-blue-100"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Speed Setting */}
            <div className="bg-white p-5 rounded-2xl border border-[#C7D2FE] shadow-2xs space-y-3">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                २. ऑडियो एवं उच्चारण गति:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  className="bg-[#EEF2FF] text-blue-900 border border-[#C7D2FE] py-2.5 rounded-xl hover:bg-blue-100"
                  onClick={() => alert("धीमी गति (०.८x) सेट की गई")}
                >
                  धीमी गति (०.८x)
                </button>
                <button
                  type="button"
                  className="bg-blue-600 text-white py-2.5 rounded-xl shadow-xs"
                  onClick={() => alert("सामान्य गति (१.०x) सक्रिय है")}
                >
                  सामान्य गति (१.०x)
                </button>
                <button
                  type="button"
                  className="bg-[#EEF2FF] text-blue-900 border border-[#C7D2FE] py-2.5 rounded-xl hover:bg-blue-100"
                  onClick={() => alert("तेज़ गति (१.२x) सेट की गई")}
                >
                  तेज़ गति (१.२x)
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  alert("प्राथमिकताएं सहेज ली गईं!");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                सहेजें और बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// INTERACTIVE DRAWING CANVAS COMPONENT
// ---------------------------------------------------------------------------
function DrawingCanvasModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#2563EB");
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill canvas with clean white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = isEraser ? "#FFFFFF" : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `meri-chitrakala-${Date.now()}.png`;
    link.href = image;
    link.click();
  };

  const COLORS = [
    { name: "नीला", value: "#2563EB" },
    { name: "लाल", value: "#DC2626" },
    { name: "हरा", value: "#16A34A" },
    { name: "पीला", value: "#EAB308" },
    { name: "नारंगी", value: "#EA580C" },
    { name: "बैंगनी", value: "#9333EA" },
    { name: "गुलाबी", value: "#DB2777" },
    { name: "काला", value: "#0F172A" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl p-1.5 bg-[#EEF2FF] rounded-xl border border-[#C7D2FE]">🎨</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">चित्रकला व रंग भरो (Drawing Canvas)</h3>
              <p className="text-xs text-slate-500 font-medium">मनपसंद रंग चुनें, चित्र बनाएं और सहेजें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tools & Palette Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EEF2FF] p-3 rounded-2xl border border-[#C7D2FE]">
          {/* Color Palette */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">रंग:</span>
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setColor(c.value);
                    setIsEraser(false);
                  }}
                  className={`w-7 h-7 rounded-full transition transform active:scale-95 ${
                    !isEraser && color === c.value ? "ring-3 ring-blue-600 scale-110 shadow-sm" : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Brush / Eraser Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEraser(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                !isEraser
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-[#C7D2FE]"
              }`}
            >
              ✏️ ब्रश
            </button>
            <button
              onClick={() => setIsEraser(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                isEraser
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-[#C7D2FE]"
              }`}
            >
              🧹 रबर (इरेज़र)
            </button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">साइज:</span>
            {[3, 6, 12].map((sz) => (
              <button
                key={sz}
                onClick={() => setBrushSize(sz)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                  brushSize === sz
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-[#C7D2FE]"
                }`}
              >
                {sz === 3 ? "पतला" : sz === 6 ? "मध्यम" : "मोटा"}
              </button>
            ))}
          </div>
        </div>

        {/* Actual Canvas */}
        <div className="border-2 border-dashed border-[#C7D2FE] rounded-2xl overflow-hidden bg-white shadow-inner flex justify-center">
          <canvas
            ref={canvasRef}
            width={680}
            height={360}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair w-full max-w-full touch-none"
          />
        </div>

        {/* Canvas Bottom Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={clearCanvas}
            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>🗑️</span>
            <span>कैनवास साफ़ करें</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={downloadDrawing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>💾</span>
              <span>चित्र सहेजें (डाउनलोड)</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}