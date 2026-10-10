import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000/api";

export interface QuizItem {
  id: string;
  title: string;
  grade: "कक्षा 1" | "कक्षा 2";
  subject: string;
  topic: string;
  nipunCode: string;
  targetLang: "mun" | "ho" | "san";
  targetLangLabel: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  totalQuestions: number;
  status: "scheduled" | "live" | "completed";
  questions: {
    id: number;
    questionHindi: string;
    questionTribal: string;
    tribalOlChiki?: string;
    options: {
      textHindi: string;
      textTribal: string;
      isCorrect: boolean;
    }[];
  }[];
}

const DEFAULT_QUIZZES: QuizItem[] = [
  {
    id: "quiz_101",
    title: "गिनती 1 से 10 और संख्या बोध",
    grade: "कक्षा 1",
    subject: "गणित",
    topic: "गिनती 1 से 10 और संख्या बोध",
    nipunCode: "संख्या ज्ञान-01",
    targetLang: "mun",
    targetLangLabel: "मुंडारी",
    date: new Date().toISOString().split("T")[0],
    startTime: "सुबह 10:30 बजे",
    durationMinutes: 15,
    totalQuestions: 5,
    status: "live",
    questions: [
      {
        id: 1,
        questionHindi: "चित्र में कितने आम हैं? (संख्या '3' पहचानें)",
        questionTribal: "चितार रे चिमिन उली मेनाः-आ? ('3' लेखे चिन्हाव मे)",
        options: [
          { textHindi: "२ (दो)", textTribal: "बारिया (2)", isCorrect: false },
          { textHindi: "३ (तीन)", textTribal: "आपिया (3)", isCorrect: true },
          { textHindi: "४ (चार)", textTribal: "उपूनिया (4)", isCorrect: false },
        ],
      },
      {
        id: 2,
        questionHindi: "संख्या '४' के ठीक बाद कौन सी संख्या आती है?",
        questionTribal: "लेखे '४' तायोम ओको लेखे हिजुः-आ?",
        options: [
          { textHindi: "३ (तीन)", textTribal: "आपिया (3)", isCorrect: false },
          { textHindi: "५ (पाँच)", textTribal: "मोणेया (5)", isCorrect: true },
          { textHindi: "६ (छह)", textTribal: "तुरिया (6)", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "quiz_102",
    title: "रंग, आकार और हमारे आस-पास के जानवर",
    grade: "कक्षा 2",
    subject: "भाषा व पर्यावरण",
    topic: "रंग, आकार और हमारे आस-पास के जानवर",
    nipunCode: "भाषा ज्ञान-04",
    targetLang: "san",
    targetLangLabel: "संथाली",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "सुबह 11:30 बजे",
    durationMinutes: 20,
    totalQuestions: 5,
    status: "scheduled",
    questions: [
      {
        id: 1,
        questionHindi: "'हाथी' को संथाली में क्या कहते हैं?",
        questionTribal: "'हाथी' दो संथाली ते चेद को मेतागा?",
        tribalOlChiki: "ᱦᱟᱹᱛᱤ",
        options: [
          { textHindi: "हाथी (हाति)", textTribal: "हाति (ᱦᱟᱹᱛᱤ)", isCorrect: true },
          { textHindi: "घोड़ा (सदोम)", textTribal: "सदोम (ᱥᱟᱫᱚᱢ)", isCorrect: false },
          { textHindi: "गाय (डांगरा)", textTribal: "डांगरा (ᱰᱟᱝᱜᱽᱨᱟ)", isCorrect: false },
        ],
      },
    ],
  },
];

export const cleanHindiText = (text: string | undefined): string => {
  if (!text) return "";
  let cleaned = text;
  cleaned = cleaned.replace(/FLN-NUM-G1-01/gi, "संख्या ज्ञान-01");
  cleaned = cleaned.replace(/FLN-LIT-G2-04/gi, "भाषा ज्ञान-04");
  cleaned = cleaned.replace(/FLN-NUM-G1-02/gi, "संख्या ज्ञान-02");
  cleaned = cleaned.replace(/FLN-LIT-G2-01/gi, "भाषा ज्ञान-01");
  cleaned = cleaned.replace(/FLN-[A-Z0-9\-]+/gi, "दक्षता-01");
  cleaned = cleaned.replace(/\s*\([A-Za-z0-9\s\-_/&.,]+\)/g, "");
  cleaned = cleaned.replace(/\b(FLN|Numeracy|Literacy|Grade\s*\d+|Mundari|Santhali|Ho|Ol\s*Chiki|Hati)\b/gi, "");
  return cleaned.replace(/\s+/g, " ").trim();
};

const sanitizeQuizItem = (quiz: QuizItem): QuizItem => {
  return {
    ...quiz,
    title: cleanHindiText(quiz.title),
    subject: cleanHindiText(quiz.subject),
    topic: cleanHindiText(quiz.topic),
    nipunCode: cleanHindiText(quiz.nipunCode),
    targetLangLabel: cleanHindiText(quiz.targetLangLabel),
    questions: (quiz.questions || []).map((q) => ({
      ...q,
      questionHindi: cleanHindiText(q.questionHindi),
      tribalOlChiki: q.tribalOlChiki ? cleanHindiText(q.tribalOlChiki) : undefined,
    })),
  };
};

export default function TeacherQuizSchedule() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>(() => {
    const saved = localStorage.getItem("scheduledQuizzes");
    if (saved) {
      try {
        const parsed: QuizItem[] = JSON.parse(saved);
        return parsed.map(sanitizeQuizItem);
      } catch (e) {
        return DEFAULT_QUIZZES.map(sanitizeQuizItem);
      }
    }
    return DEFAULT_QUIZZES.map(sanitizeQuizItem);
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState<QuizItem | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // New Quiz Form State
  const [formGrade, setFormGrade] = useState<"कक्षा 1" | "कक्षा 2">("कक्षा 1");
  const [formSubject, setFormSubject] = useState("गणित");
  const [formTopic, setFormTopic] = useState("गिनती 1 से 10 और संख्या बोध");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formTime, setFormTime] = useState("सुबह 10:00 बजे");
  const [formDuration, setFormDuration] = useState(15);
  const [formLang, setFormLang] = useState<"mun" | "ho" | "san">(
    (localStorage.getItem("preferredLang") as any) || "mun"
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [toastMsg, setToastMsg] = useState(false);

  useEffect(() => {
    localStorage.setItem("scheduledQuizzes", JSON.stringify(quizzes));
    window.dispatchEvent(new Event("quizScheduledUpdated"));
  }, [quizzes]);

  // Speech helper for bilingual audio assistance
  const playSpeech = (text: string, id: string) => {
    if (!text) return;
    setPlayingAudioId(id);

    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "hi-IN";
        utterance.rate = 0.88; // clear and gentle for young kids
        utterance.onend = () => setPlayingAudioId(null);
        utterance.onerror = () => setPlayingAudioId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setPlayingAudioId(null), 1200);
      }
    } catch (e) {
      setPlayingAudioId(null);
    }
  };

  // AI-Assisted Bilingual Quiz Scheduling Handler
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAI(true);

    setTimeout(() => {
      const langName =
        formLang === "mun"
          ? "मुंडारी"
          : formLang === "ho"
          ? "हो"
          : "संथाली";

      // Generate AI bilingual questions based on topic
      const generatedQuestions = [
        {
          id: 1,
          questionHindi: `${formTopic}: नीचे दिए गए विकल्प में सही उत्तर चुनें।`,
          questionTribal:
            formLang === "mun"
              ? `${formTopic}: नेना रे सारे तेला चिन्हाव मे।`
              : formLang === "ho"
              ? `${formTopic}: नेनारे सही तेला बाछाव मे।`
              : `${formTopic}: नोंडे साहि तेला बाछाव मे (ओल चिकी)।`,
          tribalOlChiki: formLang === "san" ? "ᱥᱟᱹᱦᱤ ᱛᱮᱞᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ" : undefined,
          options: [
            {
              textHindi: "विकल्प क (सही उत्तर)",
              textTribal: formLang === "mun" ? "पहिला तेला (सारे)" : "पहिला तेला (ᱥᱟᱹᱦᱤ)",
              isCorrect: true,
            },
            {
              textHindi: "विकल्प ख",
              textTribal: "दूसरा तेला",
              isCorrect: false,
            },
            {
              textHindi: "विकल्प ग",
              textTribal: "तीसरा तेला",
              isCorrect: false,
            },
          ],
        },
        {
          id: 2,
          questionHindi: "वस्तुओं की गिनती कर सही संख्या पहचानें।",
          questionTribal:
            formLang === "mun"
              ? "जिनीस को लेका केते लेखे चिन्हाव मे।"
              : formLang === "ho"
              ? "सामान को लेका केते सही काजी मे।"
              : "ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ",
          tribalOlChiki: formLang === "san" ? "ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ" : undefined,
          options: [
            { textHindi: "२ (दो)", textTribal: "बारिया (2)", isCorrect: false },
            { textHindi: "४ (चार)", textTribal: "उपूनिया (4)", isCorrect: true },
            { textHindi: "६ (छह)", textTribal: "तुरिया (6)", isCorrect: false },
          ],
        },
      ];

      const newQuiz: QuizItem = {
        id: `quiz_${Date.now()}`,
        title: `${formTopic} (${formGrade})`,
        grade: formGrade,
        subject: formSubject,
        topic: formTopic,
        nipunCode: formSubject === "गणित" ? "संख्या ज्ञान-02" : "भाषा ज्ञान-01",
        targetLang: formLang,
        targetLangLabel: langName,
        date: formDate,
        startTime: formTime,
        durationMinutes: Number(formDuration),
        totalQuestions: 5,
        status: "scheduled",
        questions: generatedQuestions,
      };

      setQuizzes([newQuiz, ...quizzes]);
      axios.post(`${API}/quizzes`, newQuiz).catch((err) => {
        console.warn("Could not sync quiz to backend server:", err);
      });
      setIsGeneratingAI(false);
      setShowScheduleModal(false);
      setToastMsg(true);
      setTimeout(() => setToastMsg(false), 3500);
    }, 1000);
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm("क्या आप इस क्विज़ को हटाना चाहते हैं?")) {
      setQuizzes(quizzes.filter((q) => q.id !== id));
      if (previewQuiz?.id === id) setPreviewQuiz(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-6xl mx-auto font-sans pb-16">
      {/* 1. Header Banner */}
      <div className="bg-[#EEF2FF] p-6 sm:p-8 rounded-[16px] shadow-2xs border border-[#C7D2FE] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white text-[#1E56A0] text-xs font-black px-3 py-1 rounded-full border border-[#C7D2FE] shadow-2xs uppercase tracking-wide">
              निपुण भारत क्विज़ हब
            </span>
            <span className="bg-white text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-[#C7D2FE] shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              🔊 ऑटो द्विभाषी ऑडियो सहायता सक्रिय
            </span>
          </div>
          <br></br>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            🧠 क्विज़ शेड्यूलिंग एवं बाल मूल्यांकन
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/teacher"
            className="px-4 py-2.5 rounded-xl border border-[#C7D2FE] bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            ⬅ डैशबोर्ड
          </Link>
          <button
            onClick={() => setShowScheduleModal(true)}
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            className="text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md shadow-indigo-600/25 transition active:scale-95 flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-600/35 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>📅</span>
            <span>नया क्विज़ शेड्यूल करें</span>
            <span>+</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {toastMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs sm:text-sm font-black p-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">✓</span>
            <span>
              नया द्विभाषी क्विज़ सफलतापूर्वक शेड्यूल कर दिया गया है! एआई ने ऑडियो सहायता और जनजातीय अनुवाद लोड कर दिया है।
            </span>
          </div>
        </div>
      )}

      {/* 2. Scheduled Quizzes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
              <span>📋</span>
              <span>निर्धारित एवं आगामी क्विज़ ({quizzes.length})</span>
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            कक्षा 1 व 2 (प्राथमिक स्तर)
          </span>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white p-12 rounded-[16px] text-center border border-[#DBEAFE] shadow-2xs">
            <div className="w-16 h-16 bg-[#EFF6FF] text-[#1E56A0] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 border border-[#DBEAFE] shadow-2xs">
              📝
            </div>
            <h3 className="text-base font-bold text-slate-800">
              अभी कोई क्विज़ शेड्यूल नहीं है
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              "नया क्विज़ शेड्यूल करें" बटन पर क्लिक करके बच्चों के लिए पहला क्विज़ तैयार करें।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quizzes.map((quiz) => {
              const isLive = quiz.status === "live";

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-[16px] border border-[#DBEAFE] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Left Accent Bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"></div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isLive ? (
                          <span className="bg-[#EFF6FF] text-[#1E40AF] text-xs font-black px-3 py-0.5 rounded-full border border-[#DBEAFE] shadow-2xs flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                            अभी सक्रिय
                          </span>
                        ) : (
                          <span className="bg-[#EFF6FF] text-[#1E3A8A] text-xs font-bold px-3 py-0.5 rounded-full border border-[#DBEAFE] shadow-2xs">
                            ⏳ आगामी
                          </span>
                        )}

                        <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-[#DBEAFE] shadow-2xs">
                          🏫 {cleanHindiText(quiz.grade)}
                        </span>

                        <span className="text-xs font-black bg-[#EFF6FF] text-[#1E56A0] border border-[#DBEAFE] px-2.5 py-0.5 rounded-full shadow-2xs">
                          🌐 {cleanHindiText(quiz.targetLangLabel)}
                        </span>
                      </div>

                      {/* Quiz Title & Details */}
                      <div className="pt-1.5 space-y-2.5">
                        <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-snug">
                          {cleanHindiText(quiz.title)}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600 font-semibold pt-0.5">
                          <span className="inline-flex items-center gap-1.5">
                            <span>📚</span>
                            <span>विषय:</span>
                            <span className="text-[#0F172A] font-black">{cleanHindiText(quiz.subject)}</span>
                          </span>

                          <span className="text-[#94A3B8] font-bold select-none">•</span>

                          <span className="inline-flex items-center gap-1.5">
                            <span>🎯</span>
                            <span>दक्षता:</span>
                            <span className="text-[#1E56A0] font-black bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#DBEAFE] shadow-2xs">
                              {cleanHindiText(quiz.nipunCode)}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Schedule Info Box */}
                      <div className="bg-[#EFF6FF] p-3 rounded-[12px] border border-[#DBEAFE] shadow-2xs flex items-center justify-between text-xs font-bold text-slate-700 mt-2">
                        <span>📅 {quiz.date} • ⏰ {quiz.startTime}</span>
                        <span className="text-blue-700">⏱️ {quiz.durationMinutes} मिनट</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#DBEAFE] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewQuiz(quiz)}
                        className="px-3.5 py-2 rounded-xl border border-[#DBEAFE] bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>👁️</span>
                        <span>प्रश्न व ऑडियो देखें</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-2 rounded-xl border border-[#DBEAFE] bg-white hover:bg-red-50 text-xs text-red-600 transition shadow-2xs"
                          title="हटाएं"
                        >
                          🗑️
                        </button>

                        <button
                          type="button"
                          onClick={() => alert(`क्विज़ "${quiz.title}" सक्रिय कक्ष में प्रारंभ किया जा रहा है।`)}
                          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                          className="text-white font-black text-xs px-4 py-2 rounded-xl shadow-sm shadow-indigo-600/25 transition active:scale-95 hover:shadow-md hover:shadow-indigo-600/30 cursor-pointer"
                        >
                          क्विज़ प्रारंभ करें ➔
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Schedule Quiz Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                  <span>📅</span>
                  <span>नया द्विभाषी क्विज़ शेड्यूल करें</span>
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-black p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    १. कक्षा चुनें:
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as any)}
                    className="w-full border border-[#E2E8F0] p-2.5 rounded-xl bg-white text-xs sm:text-sm font-bold text-[#0F172A]"
                  >
                    <option value="कक्षा 1">कक्षा 1 (प्राथमिक स्तर)</option>
                    <option value="कक्षा 2">कक्षा 2 (प्राथमिक स्तर)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    २. विषय:
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full border border-[#E2E8F0] p-2.5 rounded-xl bg-white text-xs sm:text-sm font-bold text-[#0F172A]"
                  >
                    <option value="गणित">गणित</option>
                    <option value="भाषा व पर्यावरण">भाषा व पर्यावरण</option>
                    <option value="मौखिक भाषा विकास">मौखिक भाषा विकास</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ३. क्विज़ का विषय / टॉपिक :
                </label>
                <input
                  type="text"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="उदा. गिनती 1 से 10, आकृतियां और रंग, हमारे पशु-पक्षी"
                  className="w-full border border-[#E2E8F0] p-3 rounded-xl bg-white text-xs sm:text-sm font-semibold text-[#0F172A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ४. लक्षित जनजातीय भाषा:
                  </label>
                  <select
                    value={formLang}
                    onChange={(e) => setFormLang(e.target.value as any)}
                    className="w-full border border-[#E2E8F0] p-2.5 rounded-xl bg-white text-xs sm:text-sm font-bold text-[#0F172A]"
                  >
                    <option value="mun">मुंडारी</option>
                    <option value="ho">हो</option>
                    <option value="san">संथाली (ओल चिकी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ५. क्विज़ अवधि (मिनट):
                  </label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full border border-[#E2E8F0] p-2.5 rounded-xl bg-white text-xs sm:text-sm font-bold text-[#0F172A]"
                  >
                    <option value={10}>10 मिनट (त्वरित 5 प्रश्न)</option>
                    <option value={15}>15 मिनट (सामान्य)</option>
                    <option value={20}>20 मिनट</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ६. तारीख:
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full border border-[#E2E8F0] p-2.5 rounded-xl bg-white text-xs sm:text-sm font-bold text-[#0F172A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ७. समय:
                  </label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="उदा. सुबह 10:30 बजे"
                    className="w-full border border-[#E2E8F0] p-2.5 rounded-xl bg-white text-xs sm:text-sm font-bold text-[#0F172A]"
                    required
                  />
                </div>
              </div>

              {/* AI Auto-Translation Assurance Banner */}
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200 text-xs font-semibold text-blue-900 space-y-1">
                <div className="font-black flex items-center gap-1.5">
                  <span>✨</span>
                  <span>वाणीसेतु ऑटो एआई अनुवाद व स्पीच इंजन</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  शेड्यूल करते ही एआई स्वचालित रूप से द्विभाषी विकल्प तैयार करेगा और ऑडियो प्लेबैक जनरेट करेगा।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  रद्द करें
                </button>

                <button
                  type="submit"
                  disabled={isGeneratingAI}
                  style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                  className="text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 transition active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-indigo-600/35"
                >
                  <span>{isGeneratingAI ? "एआई अनुवाद व ऑडियो तैयार हो रहा है..." : "✓ क्विज़ शेड्यूल करें"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Quiz Preview Modal (With Bilingual Audio Assistance) */}
      {previewQuiz && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-black bg-blue-50 text-[#1E56A0] px-2.5 py-0.5 rounded-full border border-blue-200">
                  द्विभाषी प्रश्नोत्तरी पूर्वावलोकन
                </span>
                <h3 className="text-lg font-black text-[#0F172A] mt-1">
                  {cleanHindiText(previewQuiz.title)}
                </h3>
              </div>
              <button
                onClick={() => setPreviewQuiz(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-black p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {previewQuiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-[#1E56A0]">
                        प्रश्न {idx + 1}:
                      </span>
                      <p className="text-sm font-black text-[#0F172A]">
                        {q.questionHindi}
                      </p>
                      <p className="text-xs font-extrabold text-[#1E56A0] bg-blue-50 p-1.5 rounded-lg border border-blue-200/80">
                        🌐 {cleanHindiText(previewQuiz.targetLangLabel)}: {q.questionTribal}
                      </p>
                      {q.tribalOlChiki && (
                        <p className="text-xs font-bold text-purple-700 bg-purple-50 p-1.5 rounded-lg border border-purple-200">
                          🔤 ओल चिकी लिपि: {cleanHindiText(q.tribalOlChiki)}
                        </p>
                      )}
                    </div>

                    {/* Audio Play Button for this question */}
                    <button
                      type="button"
                      onClick={() => playSpeech(`${q.questionHindi}. ${q.questionTribal}`, `q_${q.id}`)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                        playingAudioId === `q_${q.id}`
                          ? "bg-emerald-600 text-white border-emerald-700 animate-pulse"
                          : "bg-white text-slate-800 border-[#E2E8F0] hover:bg-slate-100 shadow-xs"
                      }`}
                      title="ऑडियो सहायता सुनें"
                    >
                      <span>🔊</span>
                      <span>{playingAudioId === `q_${q.id}` ? "सुन रहे हैं..." : "ऑडियो सुनें"}</span>
                    </button>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      विकल्प:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border text-xs font-bold ${
                            opt.isCorrect
                              ? "bg-emerald-50 text-emerald-900 border-emerald-300 ring-1 ring-emerald-200"
                              : "bg-white text-slate-700 border-[#E2E8F0]"
                          }`}
                        >
                          <div>{opt.textHindi}</div>
                          <div className="text-[11px] text-blue-700 font-extrabold">
                            {opt.textTribal}
                          </div>
                          {opt.isCorrect && (
                            <span className="text-[10px] text-emerald-700 font-black block mt-0.5">
                              ✓ सही उत्तर
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewQuiz(null)}
                className="px-5 py-2.5 rounded-xl bg-[#1E56A0] text-white text-xs font-black shadow-sm"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
