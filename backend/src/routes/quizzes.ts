import { Router } from "express";

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

let scheduledQuizzes: QuizItem[] = [
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

let quizAttempts: QuizAttempt[] = [
  {
    id: "att_1",
    quizId: "quiz_101",
    quizTitle: "गिनती 1 से 10 और संख्या बोध",
    studentName: "सिदो मुर्मू",
    grade: "कक्षा 1",
    score: 5,
    totalQuestions: 5,
    starsEarned: 5,
    attemptedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const router = Router();

// GET all quizzes (can filter by grade: e.g. /api/quizzes?grade=कक्षा 1)
router.get("/", (req, res) => {
  const { grade } = req.query;
  let result = scheduledQuizzes;
  if (grade) {
    result = result.filter((q) => q.grade === grade);
  }
  res.json({ quizzes: result, total: result.length });
});

// POST schedule a new quiz (Teacher)
router.post("/", (req, res) => {
  const newQuiz: QuizItem = req.body;
  if (!newQuiz.id) {
    newQuiz.id = `quiz_${Date.now()}`;
  }
  scheduledQuizzes.unshift(newQuiz);
  res.status(201).json({ success: true, quiz: newQuiz });
});

// POST submit quiz result (Student)
router.post("/:id/submit", (req, res) => {
  const { id } = req.params;
  const { studentName, grade, score, totalQuestions, starsEarned } = req.body;
  
  const quiz = scheduledQuizzes.find((q) => q.id === id);
  const title = quiz ? quiz.title : "क्विज़ मूल्यांकन";

  const attempt: QuizAttempt = {
    id: `att_${Date.now()}`,
    quizId: id,
    quizTitle: title,
    studentName: studentName || "विद्यार्थी",
    grade: grade || "कक्षा 1",
    score: Number(score) || 0,
    totalQuestions: Number(totalQuestions) || 5,
    starsEarned: Number(starsEarned) || Number(score) || 5,
    attemptedAt: new Date().toISOString(),
  };

  quizAttempts.unshift(attempt);
  res.status(201).json({ success: true, attempt });
});

// GET all attempts for a student or teacher
router.get("/attempts", (req, res) => {
  const { grade } = req.query;
  let result = quizAttempts;
  if (grade) {
    result = result.filter((a) => a.grade === grade);
  }
  res.json({ attempts: result, total: result.length });
});

export default router;
