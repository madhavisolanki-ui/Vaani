import { Request, Response } from "express";
import { aiService } from "../services/aiService";
import { TribalLanguage, SUPPORTED_LANGUAGES } from "../services/tribalKnowledgeBase";

export const NIPUN_BHARAT_COMPETENCIES = [
  {
    code: "FLN-L1.1",
    grade: "कक्षा 1",
    domain: "(मौखिक भाषा विकास",
    descriptionHindi: "दैनिक बातचीत में अपनी मातृभाषा और हिंदी में सहजता से भाग लेना।",
    descriptionTribal: "ᱫᱤᱱᱟᱹᱢ ᱜᱟᱯᱟᱞᱢᱟᱨᱟᱣ ᱨᱮ ᱟᱯᱱᱟᱨ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱨᱚᱲ ᱫᱟᱲᱮᱭᱟᱜ।",
  },
  {
    code: "FLN-L1.2",
    grade: "कक्षा 1",
    domain: "ध्वनि चेतना",
    descriptionHindi: "ध्वनियों को पहचानना और तुकबंदी वाले शब्दों का उच्चारण करना।",
    descriptionTribal: "ᱥᱟᱰᱮ ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ ᱥᱟᱹᱜᱟᱹᱭᱟᱱ ᱟᱹᱲᱟᱹ ᱢᱮᱱ।",
  },
  {
    code: "FLN-N1.1",
    grade: "कक्षा 1",
    domain: "संख्या बोध 1-9",
    descriptionHindi: "1 से 9 तक की संख्याओं को ठोस वस्तुओं के साथ गिनना और लिखना।",
    descriptionTribal: "᱑ ᱠᱷᱚᱱ ᱙ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱟᱨ ᱚᱞ।",
  },
  {
    code: "FLN-N1.2",
    grade: "कक्षा 1",
    domain: "संख्या बोध 1-20",
    descriptionHindi: "1 से 20 तक की वस्तुओं की गिनती और छोटे-बड़े का ज्ञान।",
    descriptionTribal: "᱑ ᱠᱷᱚᱱ ᱒᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱡᱤᱱᱤᱥ ᱞᱮᱠᱷᱟ ᱟᱨ ᱢᱟᱨᱟᱝ-ᱦᱩᱰᱤᱧ ᱵᱟᱰᱟᱭ।",
  },
  {
    code: "FLN-L2.1",
    grade: "कक्षा 2",
    domain: "पठन प्रवाह",
    descriptionHindi: "सरल वाक्यों को समझ के साथ पढ़ना (30-35 शब्द प्रति मिनट)।",
    descriptionTribal: "ᱟᱞᱜᱟ ᱟᱭᱟᱛ ᱠᱚ ᱵᱩᱡᱷᱟᱹᱣ ᱥᱟᱶ ᱯᱟᱲᱦᱟᱣ।",
  },
  {
    code: "FLN-N2.1",
    grade: "कक्षा 2",
    domain: "जोड़ और घटाव",
    descriptionHindi: "दैनिक जीवन में 99 तक की संख्याओं का सरल जोड़-घटाव।",
    descriptionTribal: "ᱫᱤᱱᱟᱹᱢ ᱡᱤᱭᱚᱱ ᱨᱮ ᱙᱙ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱢᱮᱥᱟ ᱟᱨ ᱜᱮᱫ।",
  },
];

export const FLN_TOPICS = [
  { id: "counting_1_10", name: "गिनती 1-10", grade: "Grade 1", subject: "Numeracy", category: "numbers" },
  { id: "colors_basic", name: "रंगों के नाम", grade: "Grade 1", subject: "Literacy", category: "colors" },
  { id: "animals_around", name: "हमारे आस-पास के जानवर", grade: "Grade 1", subject: "Environmental / Literacy", category: "animals" },
  { id: "fruits_veggies", name: "फल और सब्जियां", grade: "Grade 2", subject: "Environmental / Literacy", category: "fruits_food" },
  { id: "classroom_rules", name: "कक्षा के नियम और बातचीत", grade: "Grade 1", subject: "Literacy", category: "classroom_commands" },
];

export async function getCompetencies(req: Request, res: Response) {
  const grade = req.query.grade as string;
  const filtered = grade
    ? NIPUN_BHARAT_COMPETENCIES.filter((c) => c.grade.toLowerCase() === grade.toLowerCase())
    : NIPUN_BHARAT_COMPETENCIES;

  res.json({
    total: filtered.length,
    competencies: filtered,
  });
}

export async function getTopics(req: Request, res: Response) {
  res.json({
    topics: FLN_TOPICS,
    supportedLanguages: SUPPORTED_LANGUAGES,
  });
}

export interface ScheduledClass {
  id: string;
  date: string;
  subject: string;
  topic: string;
  medium: string;
  grade: string;
  startTime: string;
  endTime: string;
  status: string;
  roomCode: string;
  createdAt: string;
  updatedAt?: string;
  isExpired?: boolean;
  isLocked?: boolean;
  remainingMinutes?: number;
}

// In-Memory Data Stores for Lesson Planner Hub (Hindi Medium)
let scheduledClasses: ScheduledClass[] = [
  {
    id: "cls_1",
    date: new Date().toISOString().split("T")[0],
    subject: "गणित",
    topic: "गिनती 1 से 10 और संख्या बोध",
    medium: "हिंदी",
    grade: "कक्षा 1",
    startTime: "09:30 AM",
    endTime: "10:15 AM",
    status: "live",
    roomCode: "FLN-HIN-101",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cls_2",
    date: new Date().toISOString().split("T")[0],
    subject: "भाषा व पर्यावरण",
    topic: "रंग, आकार और हमारे आस-पास के जानवर",
    medium: "हिंदी",
    grade: "कक्षा 2",
    startTime: "11:30 AM",
    endTime: "12:15 PM",
    status: "upcoming",
    roomCode: "FLN-HIN-202",
    createdAt: new Date().toISOString(),
  },
];

let classNotes = [
  {
    id: "note_1",
    classId: "cls_1",
    date: new Date().toISOString().split("T")[0],
    title: "कक्षा 1: 1 से 10 तक गिनती और संख्या अवधारणा",
    subject: "गणित",
    topic: "गिनती 1 से 10",
    grade: "कक्षा 1",
    medium: "हिंदी",
    teacherSummary: "आज की कक्षा में छात्रों को कंकड़, चित्रों और उंगलियों के माध्यम से 1 से 10 तक की संख्या पहचान और लेखन का अभ्यास कराया गया।",
    keyPoints: [
      "संख्या 1 से 5 की ठोस वस्तुओं के साथ पहचान और सही उच्चारण",
      "संख्या 6 से 10 तक वस्तुओं का समूह बनाकर गिनना",
      "छात्रों ने कक्षा में अपनी पसंदीदा वस्तुओं को गिनकर उत्तर दिया",
    ],
    vocabulary: [
      { term: "संख्या", meaning: "गिनती व्यक्त करने वाला अंक", example: "1, 2, 3, 4, 5" },
      { term: "गणना", meaning: "एक-एक करके गिनने की क्रिया", example: "वस्तुओं को गिनना" },
      { term: "समूह", meaning: "एक साथ रखी गई कई वस्तुएं", example: "5 कंकड़ों का समूह" },
    ],
    studentTask: "घर पर अपने कमरे में रखी किन्हीं 5 वस्तुओं को गिनकर उनके नाम कॉपी में लिखें।",
    createdAt: new Date().toISOString(),
  },
];

let practicePapers = [
  {
    id: "paper_1",
    classId: "cls_1",
    date: new Date().toISOString().split("T")[0],
    title: "अभ्यास पत्रक 1: संख्या पहचान एवं सरल मिलान",
    grade: "कक्षा 1",
    subject: "गणित",
    topic: "गिनती 1 से 10",
    medium: "हिंदी",
    instructionsHindi: "नीचे दिए गए सभी प्रश्नों को ध्यानपूर्वक पढ़कर सही उत्तर पर निशान लगाएं।",
    totalMarks: 10,
    durationMinutes: 20,
    questions: [
      {
        qNum: 1,
        questionHindi: "संख्या '3' के ठीक बाद कौन सी संख्या आती है?",
        type: "mcq",
        options: ["2", "4", "5", "6"],
        correctAnswer: "4",
        marks: 2,
      },
      {
        qNum: 2,
        questionHindi: "पाँच (5) अंगुलियों में से 2 कम करने पर कितनी अंगुलियां बचेंगी?",
        type: "mcq",
        options: ["2", "3", "4", "1"],
        correctAnswer: "3",
        marks: 2,
      },
      {
        qNum: 3,
        questionHindi: "रिक्त स्थान भरें: 1, 2, 3, ___, 5, 6",
        type: "fill",
        options: ["4", "7", "8"],
        correctAnswer: "4",
        marks: 3,
      },
      {
        qNum: 4,
        questionHindi: "मौखिक अभ्यास: 1 से 10 तक सीधी गिनती शिक्षक को सुनाएं।",
        type: "oral",
        marks: 3,
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

// Helper to parse time string like "09:30 AM", "14:15", "02:00 PM" into minutes from midnight
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  const isPM = clean.toUpperCase().includes("PM");
  const isAM = clean.toUpperCase().includes("AM");
  const numPart = clean.replace(/AM|PM/gi, "").trim();
  const [hStr, mStr] = numPart.split(":");
  let hour = parseInt(hStr, 10) || 0;
  const min = parseInt(mStr, 10) || 0;
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;
  return hour * 60 + min;
}

export function computeClassStatus(cls: any): {
  status: "upcoming" | "live" | "ended";
  isExpired: boolean;
  isLocked: boolean;
  remainingMinutes?: number;
} {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const classDateStr = cls.date || todayStr;

    const classDate = new Date(classDateStr + "T00:00:00");
    const todayDate = new Date(todayStr + "T00:00:00");

    if (classDate < todayDate) {
      return { status: "ended", isExpired: true, isLocked: true };
    }

    if (classDate > todayDate) {
      return { status: "upcoming", isExpired: false, isLocked: false };
    }

    // Same Day calculation
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = parseTimeToMinutes(cls.startTime || "00:00");
    const endMinutes = parseTimeToMinutes(cls.endTime || "23:59");

    if (nowMinutes >= endMinutes) {
      return { status: "ended", isExpired: true, isLocked: true };
    } else if (nowMinutes >= startMinutes && nowMinutes < endMinutes) {
      return {
        status: "live",
        isExpired: false,
        isLocked: false,
        remainingMinutes: endMinutes - nowMinutes,
      };
    } else {
      return { status: "upcoming", isExpired: false, isLocked: false };
    }
  } catch (err) {
    return { status: cls.status || "upcoming", isExpired: false, isLocked: false };
  }
}

// Scheduled Classes APIs
export async function getScheduledClasses(req: Request, res: Response) {
  const annotated = scheduledClasses.map((cls) => {
    const lifecycle = computeClassStatus(cls);
    return {
      ...cls,
      status: lifecycle.status,
      isExpired: lifecycle.isExpired,
      isLocked: lifecycle.isLocked,
      remainingMinutes: lifecycle.remainingMinutes,
    };
  });
  res.json({ classes: annotated });
}

export async function addScheduledClass(req: Request, res: Response) {
  const { date, startTime, endTime, subject, topic, grade, medium, roomCode } = req.body;
  if (!subject || !topic || !date) {
    return res.status(400).json({ error: "Missing required class fields" });
  }

  const rawClass = {
    id: `cls_${Date.now()}`,
    date: date || new Date().toISOString().split("T")[0],
    startTime: startTime || "10:00 AM",
    endTime: endTime || "10:45 AM",
    subject,
    topic,
    grade: grade || "कक्षा 1",
    medium: medium || "हिंदी",
    roomCode: roomCode || `FLN-${(medium === "English" ? "ENG" : "HIN")}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
  };

  const lifecycle = computeClassStatus(rawClass);
  const newClass = {
    ...rawClass,
    status: lifecycle.status,
    isExpired: lifecycle.isExpired,
    isLocked: lifecycle.isLocked,
  };

  scheduledClasses.unshift(newClass as any);
  res.status(201).json({ success: true, class: newClass, classes: scheduledClasses });
}

export async function updateScheduledClass(req: Request, res: Response) {
  const { id } = req.params;
  const { date, startTime, endTime, subject, topic, grade, medium, roomCode } = req.body;

  const targetIdx = scheduledClasses.findIndex((c) => c.id === id);
  if (targetIdx === -1) {
    return res.status(404).json({ error: "Class not found" });
  }

  const currentClass = scheduledClasses[targetIdx];
  const currentLifecycle = computeClassStatus(currentClass);

  // Strict Lock Check: If class has ended/expired, nobody can edit it!
  if (currentLifecycle.isExpired || currentClass.status === "ended") {
    return res.status(403).json({
      error: "🔒 यह कक्षा समाप्त हो चुकी है। समय समाप्त होने के बाद क्लास को संपादित नहीं किया जा सकता।",
      isLocked: true,
    });
  }

  const updatedRaw = {
    ...currentClass,
    date: date || currentClass.date,
    startTime: startTime || currentClass.startTime,
    endTime: endTime || currentClass.endTime,
    subject: subject || currentClass.subject,
    topic: topic || currentClass.topic,
    grade: grade || currentClass.grade,
    medium: medium || currentClass.medium,
    roomCode: roomCode || currentClass.roomCode,
    updatedAt: new Date().toISOString(),
  };

  const newLifecycle = computeClassStatus(updatedRaw);
  scheduledClasses[targetIdx] = {
    ...updatedRaw,
    status: newLifecycle.status,
    isExpired: newLifecycle.isExpired,
    isLocked: newLifecycle.isLocked,
  };

  res.json({
    success: true,
    class: scheduledClasses[targetIdx],
    classes: scheduledClasses,
    message: "कक्षा सफलतापूर्वक अपडेट कर दी गई!",
  });
}

export async function deleteScheduledClass(req: Request, res: Response) {
  const { id } = req.params;
  scheduledClasses = scheduledClasses.filter((c) => c.id !== id);
  res.json({ success: true, classes: scheduledClasses });
}

// Class Notes APIs
export async function getClassNotes(req: Request, res: Response) {
  const { date, classId } = req.query;
  let filtered = classNotes;
  if (date) {
    filtered = filtered.filter((n) => n.date === date);
  }
  if (classId) {
    filtered = filtered.filter((n) => n.classId === classId);
  }
  res.json({ notes: filtered });
}

export async function addClassNote(req: Request, res: Response) {
  const { classId, date, title, subject, topic, grade, medium, teacherSummary, keyPoints, vocabulary, studentTask } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: "Title and date are required" });
  }

  const newNote = {
    id: `note_${Date.now()}`,
    classId: classId || "",
    date,
    title,
    subject: subject || "सामान्य शिक्षण (General)",
    topic: topic || "",
    grade: grade || "कक्षा 1",
    medium: medium || "हिंदी",
    teacherSummary: teacherSummary || "",
    keyPoints: Array.isArray(keyPoints) ? keyPoints : (keyPoints ? [keyPoints] : []),
    vocabulary: Array.isArray(vocabulary) ? vocabulary : [],
    studentTask: studentTask || "",
    createdAt: new Date().toISOString(),
  };

  classNotes.unshift(newNote);
  res.status(201).json({ success: true, note: newNote, notes: classNotes });
}

export async function deleteClassNote(req: Request, res: Response) {
  const { id } = req.params;
  classNotes = classNotes.filter((n) => n.id !== id);
  res.json({ success: true, notes: classNotes });
}

// Practice Papers APIs
export async function getPracticePapers(req: Request, res: Response) {
  const { grade } = req.query;
  let filtered = practicePapers;
  if (grade) {
    filtered = filtered.filter((p) => p.grade.toLowerCase().includes((grade as string).toLowerCase()));
  }
  res.json({ papers: filtered });
}

export async function addPracticePaper(req: Request, res: Response) {
  const { classId, title, grade, subject, topic, medium, instructionsHindi, totalMarks, durationMinutes, questions } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required for practice paper" });
  }

  const newPaper = {
    id: `paper_${Date.now()}`,
    classId: classId || "",
    date: new Date().toISOString().split("T")[0],
    title,
    grade: grade || "कक्षा 1",
    subject: subject || "General",
    topic: topic || "",
    medium: medium || "हिंदी",
    instructionsHindi: instructionsHindi || "सभी प्रश्नों के उत्तर ध्यानपूर्वक दें।",
    totalMarks: totalMarks || 10,
    durationMinutes: durationMinutes || 20,
    questions: Array.isArray(questions) ? questions : [],
    createdAt: new Date().toISOString(),
  };

  practicePapers.unshift(newPaper);
  res.status(201).json({ success: true, paper: newPaper, papers: practicePapers });
}

export async function deletePracticePaper(req: Request, res: Response) {
  const { id } = req.params;
  practicePapers = practicePapers.filter((p) => p.id !== id);
  res.json({ success: true, papers: practicePapers });
}

export async function generateLessonPlan(req: Request, res: Response) {
  try {
    const { topic, grade, subject, targetLang } = req.body as {
      topic: string;
      grade?: string;
      subject?: string;
      targetLang?: TribalLanguage;
    };

    if (!topic) {
      return res.status(400).json({ error: "Topic is required for lesson plan generation" });
    }

    const validLang: TribalLanguage = (targetLang === "ho" || targetLang === "mun") ? targetLang : "san";
    const plan = await aiService.generateLessonPlan(topic, grade, subject, validLang);

    res.json({
      success: true,
      lessonPlan: plan,
    });
  } catch (error: any) {
    console.error("Error generating lesson plan:", error);
    res.status(500).json({ error: "Failed to generate lesson plan", details: error.message });
  }
}
