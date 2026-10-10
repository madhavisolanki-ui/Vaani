import axios from "axios";

const API = "http://localhost:4000/api";

export interface QuizQuestion {
  id: number;
  questionHindi: string;
  questionTribal: string;
  tribalOlChiki?: string;
  audioText?: string;
  options: {
    textHindi: string;
    textTribal: string;
    isCorrect: boolean;
  }[];
}

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
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentName: string;
  grade: string;
  score: number;
  totalQuestions: number;
  starsEarned: number;
  attemptedAt: string;
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
        questionHindi: "चित्र में कितने आम हैं? 🥭 🥭 🥭 (संख्या '3' पहचानें)",
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
      {
        id: 3,
        questionHindi: "हाथ के एक पंजे में कितनी उंगलियां होती हैं? 🖐️",
        questionTribal: "ती रे चिमिन गांडु मेनाः-आ? 🖐️",
        options: [
          { textHindi: "४ (चार)", textTribal: "उपूनिया (4)", isCorrect: false },
          { textHindi: "५ (पाँच)", textTribal: "मोणेया (5)", isCorrect: true },
          { textHindi: "६ (छह)", textTribal: "तुरिया (6)", isCorrect: false },
        ],
      },
      {
        id: 4,
        questionHindi: "संख्या '१' को मुंडारी में क्या कहते हैं?",
        questionTribal: "लेखे '१' दो मुंडारी ते चेद को मेताः-आ?",
        options: [
          { textHindi: "एक (मियाद)", textTribal: "मियाद (1)", isCorrect: true },
          { textHindi: "दो (बारिया)", textTribal: "बारिया (2)", isCorrect: false },
          { textHindi: "तीन (आपिया)", textTribal: "आपिया (3)", isCorrect: false },
        ],
      },
      {
        id: 5,
        questionHindi: "२ + १ जोड़ने पर कुल कितना होगा? (🍎🍎 + 🍎)",
        questionTribal: "बारिया आर मियाद मिसा लेरे चिमिन होयोः-आ?",
        options: [
          { textHindi: "२ (दो)", textTribal: "बारिया (2)", isCorrect: false },
          { textHindi: "३ (तीन)", textTribal: "आपिया (3)", isCorrect: true },
          { textHindi: "४ (चार)", textTribal: "उपूनिया (4)", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "quiz_102",
    title: "रंग, पशु-पक्षी और हमारे आस-पास का पर्यावरण",
    grade: "कक्षा 1",
    subject: "भाषा व पर्यावरण",
    topic: "रंग, पशु-पक्षी और पर्यावरण",
    nipunCode: "भाषा ज्ञान-02",
    targetLang: "mun",
    targetLangLabel: "मुंडारी",
    date: new Date().toISOString().split("T")[0],
    startTime: "दोपहर 12:00 बजे",
    durationMinutes: 15,
    totalQuestions: 4,
    status: "live",
    questions: [
      {
        id: 1,
        questionHindi: "चित्र में दिख रही गाय 🐄 को स्थानीय भाषा में क्या कहते हैं?",
        questionTribal: "गाइ (🐄) दो मुंडारी/संथाली ते चेद को मेतागा?",
        options: [
          { textHindi: "गाय (गाई)", textTribal: "गाई (ᱜᱟᱹᱭ)", isCorrect: true },
          { textHindi: "कुत्ता (सेता)", textTribal: "सेता (ᱥᱮᱛᱟ)", isCorrect: false },
          { textHindi: "चिड़िया (चेँड़े)", textTribal: "चेँड़े (ᱪᱮᱬᱮ)", isCorrect: false },
        ],
      },
      {
        id: 2,
        questionHindi: "पेड़ों के पत्तों 🍃 का रंग कैसा होता है?",
        questionTribal: "दारू साकाम रेयाः रंग चिलका ताहेना?",
        options: [
          { textHindi: "हरा (हरियर)", textTribal: "हरियर (ᱦᱟᱹᱨᱭᱟᱹᱲ)", isCorrect: true },
          { textHindi: "लाल (आराः)", textTribal: "आराः (ᱟᱨᱟᱜ)", isCorrect: false },
          { textHindi: "पीला (ससांग)", textTribal: "ससांग (ᱥᱟᱥᱟᱝ)", isCorrect: false },
        ],
      },
      {
        id: 3,
        questionHindi: "सूरज ☀️ को मुंडारी में 'सिंगी' कहते हैं। यह कब निकलता है?",
        questionTribal: "सिंगी (☀️) दो तिस ओड़ोकोः-आ?",
        options: [
          { textHindi: "सुबह / दिन में", textTribal: "सेता / सिंगी बेड़ा", isCorrect: true },
          { textHindi: "रात में", textTribal: "ञिंदा बेड़ा", isCorrect: false },
        ],
      },
      {
        id: 4,
        questionHindi: "'पानी' 💧 को संथाली/मुंडारी में क्या कहते हैं?",
        questionTribal: "'पानी' दो अबुवाः भाषा ते चेद को काजीया?",
        options: [
          { textHindi: "दाः (पानी)", textTribal: "दाः (ᱫᱟᱜ)", isCorrect: true },
          { textHindi: "सेंगल (आग)", textTribal: "सेंगल (ᱥᱮᱸᱜᱮᱞ)", isCorrect: false },
          { textHindi: "होयो (हवा)", textTribal: "होयो (ᱦᱚᱭ)", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "quiz_103",
    title: "शब्द ज्ञान एवं स्थानीय पशु-पक्षी",
    grade: "कक्षा 2",
    subject: "भाषा व साक्षरता",
    topic: "शब्द ज्ञान एवं स्थानीय पशु-पक्षी",
    nipunCode: "भाषा ज्ञान-04",
    targetLang: "san",
    targetLangLabel: "संथाली",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "सुबह 11:30 बजे",
    durationMinutes: 20,
    totalQuestions: 3,
    status: "scheduled",
    questions: [
      {
        id: 1,
        questionHindi: "'हाथी' 🐘 को संथाली (ओल चिकी) में क्या कहते हैं?",
        questionTribal: "'हाथी' दो संथाली ते चेद को मेतागा?",
        tribalOlChiki: "ᱦᱟᱹᱛᱤ",
        options: [
          { textHindi: "हाथी (हाति)", textTribal: "हाति (ᱦᱟᱹᱛᱤ)", isCorrect: true },
          { textHindi: "घोड़ा (सदोम)", textTribal: "सदोम (ᱥᱟᱫᱚᱢ)", isCorrect: false },
          { textHindi: "बैल (डांगरा)", textTribal: "डांगरा (ᱰᱟᱝᱜᱽᱨᱟ)", isCorrect: false },
        ],
      },
      {
        id: 2,
        questionHindi: "आकाश ☁️ में उड़ने वाले पक्षी को क्या कहते हैं?",
        questionTribal: "सेरमा रे उडौः चेँड़े दो चेद को मेताकोवा?",
        tribalOlChiki: "ᱪᱮᱬᱮ",
        options: [
          { textHindi: "चेँड़े (पक्षी)", textTribal: "चेँड़े (ᱪᱮᱬᱮ)", isCorrect: true },
          { textHindi: "हाकू (मछली)", textTribal: "हाकू (ᱦᱟᱹᱠᱩ)", isCorrect: false },
        ],
      },
      {
        id: 3,
        questionHindi: "'घर' 🏠 को संथाली में क्या कहते हैं?",
        questionTribal: "'घर' दो संथाली ते चेद को मेतागा?",
        tribalOlChiki: "ᱚᱲᱟᱜ",
        options: [
          { textHindi: "ओड़ाः (घर)", textTribal: "ओड़ाः (ᱚᱲᱟᱜ)", isCorrect: true },
          { textHindi: "बीर (जंगल)", textTribal: "बीर (ᱵᱤᱨ)", isCorrect: false },
        ],
      },
    ],
  },
];

export async function fetchScheduledQuizzes(gradeFilter?: string): Promise<QuizItem[]> {
  try {
    const res = await axios.get(`${API}/quizzes${gradeFilter ? `?grade=${encodeURIComponent(gradeFilter)}` : ""}`);
    if (res.data?.quizzes && Array.isArray(res.data.quizzes)) {
      // Merge with any locally added quizzes from teacher
      const local = localStorage.getItem("scheduledQuizzes");
      if (local) {
        try {
          const parsedLocal: QuizItem[] = JSON.parse(local);
          const map = new Map<string, QuizItem>();
          res.data.quizzes.forEach((q: QuizItem) => map.set(q.id, q));
          parsedLocal.forEach((q: QuizItem) => map.set(q.id, q));
          const merged = Array.from(map.values());
          return gradeFilter ? merged.filter((q) => q.grade === gradeFilter) : merged;
        } catch (e) {
          // ignore
        }
      }
      return res.data.quizzes;
    }
  } catch (err) {
    console.warn("Backend quiz fetch failed, using local storage fallback", err);
  }

  // Fallback to localStorage or DEFAULT_QUIZZES
  const saved = localStorage.getItem("scheduledQuizzes");
  if (saved) {
    try {
      const parsed: QuizItem[] = JSON.parse(saved);
      return gradeFilter ? parsed.filter((q) => q.grade === gradeFilter) : parsed;
    } catch (e) {
      // ignore
    }
  }

  return gradeFilter ? DEFAULT_QUIZZES.filter((q) => q.grade === gradeFilter) : DEFAULT_QUIZZES;
}

export async function submitQuizAttempt(payload: {
  quizId: string;
  quizTitle: string;
  studentName: string;
  grade: string;
  score: number;
  totalQuestions: number;
  starsEarned: number;
}): Promise<QuizAttempt> {
  const attempt: QuizAttempt = {
    id: `att_${Date.now()}`,
    quizId: payload.quizId,
    quizTitle: payload.quizTitle,
    studentName: payload.studentName || "विद्यार्थी",
    grade: payload.grade || "कक्षा 1",
    score: payload.score,
    totalQuestions: payload.totalQuestions,
    starsEarned: payload.starsEarned,
    attemptedAt: new Date().toISOString(),
  };

  // 1. Save locally
  const currentAttempts = getStoredQuizAttempts();
  currentAttempts.unshift(attempt);
  localStorage.setItem("studentQuizAttempts", JSON.stringify(currentAttempts));

  // 2. Increment student stars in localStorage
  const currentStars = Number(localStorage.getItem("studentStars") || "24");
  const newStars = currentStars + payload.starsEarned;
  localStorage.setItem("studentStars", String(newStars));
  window.dispatchEvent(new CustomEvent("student_stars_updated", { detail: newStars }));
  window.dispatchEvent(new Event("student_quizzes_updated"));

  // 3. Sync with backend API asynchronously
  try {
    await axios.post(`${API}/quizzes/${payload.quizId}/submit`, payload);
  } catch (err) {
    console.warn("Async quiz attempt sync to backend failed:", err);
  }

  return attempt;
}

export function getStoredQuizAttempts(): QuizAttempt[] {
  const saved = localStorage.getItem("studentQuizAttempts");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  return [
    {
      id: "att_initial",
      quizId: "quiz_101",
      quizTitle: "गिनती 1 से 10 और संख्या बोध",
      studentName: localStorage.getItem("userName") || "सिदो मुर्मू",
      grade: localStorage.getItem("studentGrade") || "कक्षा 1",
      score: 5,
      totalQuestions: 5,
      starsEarned: 5,
      attemptedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];
}
