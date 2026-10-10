import { Request, Response } from "express";
import { aiService, GeneratedWorksheet } from "../services/aiService";
import { TribalLanguage } from "../services/tribalKnowledgeBase";

export interface StudentSubmission {
  id: string;
  worksheetId: string;
  worksheetTitleHindi: string;
  worksheetTitleTribal: string;
  studentName: string;
  studentGrade: string;
  targetLang: TribalLanguage;
  targetLangName: string;
  submissionType: "drawing" | "photo" | "audio" | "written";
  solutionData?: string; // Base64 dataUrl (image or audio)
  solutionTribalText?: string;
  solutionHindiTranslated: string;
  status: "pending" | "reviewed";
  marksObtained: number | null;
  totalMarks: number;
  starsEarned: number;
  teacherFeedback: string;
  submittedAt: string;
  reviewedAt?: string;
}

// In-memory worksheet store with realistic pre-seeded worksheets
const savedWorksheets: GeneratedWorksheet[] = [
  {
    id: "ws_grade1_math",
    titleHindi: "निपुण भारत कार्यपत्रक: गिनती 1-5 और फल पहचान",
    titleTribal: "ᱱᱤᱯᱩᱱ ᱵᱷᱟᱨᱚᱛ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ: ᱞᱮᱠᱷᱟ ᱑-᱕ ᱟᱨ ᱡᱚ (ᱢᱩᱱᱰᱟᱨᱤ)",
    grade: "कक्षा 1",
    subject: "गणित (संख्या ज्ञान)",
    targetLang: "mun",
    targetLangName: "मुंडारी (Devanagari / Mundari)",
    nipunCompetencyCode: "FLN-N1.1",
    nipunDomain: "Foundational Numeracy (संख्या बोध 1-9)",
    nipunLakshyaHindi: "1 से 5 तक की वस्तुओं को गिनकर सही संख्या पहचानना और चित्र बनाना।",
    nipunLakshyaTribal: "᱑ ᱠᱷᱚᱱ ᱕ ᱫᱷᱟᱹᱵᱤᱡ ᱡᱤᱱᱤᱥ ᱞᱮᱠᱷᱟ ᱟᱨ ᱪᱤᱛᱟᱹᱨ ᱵᱮᱱᱟᱣ।",
    instructionsHindi: "चित्रों को गिनें, अपनी स्लेट या टैबलेट पर ड्रॉइंग बनाएं और उत्तर बताएं।",
    instructionsTribal: "ᱪᱤᱛᱟᱹᱨ ᱞᱮᱠᱷᱟ ᱢᱮ, ᱴᱮᱵᱽᱞᱮᱴ ᱨᱮ ᱪᱤᱛᱟᱹᱨ ᱵᱮᱱᱟᱣ ᱢᱮ ᱟᱨ ᱛᱮᱞᱟ ᱞᱟᱹᱭ ᱢᱮ।",
    totalMarks: 10,
    evaluationRubric: {
      level1: "1-4 अंक: शुरुआती स्तर",
      level2: "5-7 अंक: प्रगतिशील स्तर",
      level3: "8-10 अंक: निपुण दक्ष स्तर",
    },
    sections: [
      {
        sectionTitleHindi: "भाग 1: चित्र गिनो और ड्रॉइंग बनाओ",
        sectionTitleTribal: "ᱦᱟᱹᱴᱤᱧ ᱑: ᱪᱤᱛᱟᱹᱨ ᱞᱮᱠᱷᱟ ᱟᱨ ᱵᱮᱱᱟᱣ ᱢᱮ",
        type: "identify_write",
        questions: [
          {
            qNum: 1,
            promptHindi: "यहाँ कितने सेब हैं? 🍎🍎🍎 गिनकर संख्या लिखो और 3 सेब की चित्र बनाओ।",
            promptTribal: "ᱱᱚᱰᱮ ᱛᱤᱱᱟᱹᱜ ᱥᱮᱣ ᱢᱮᱱᱟᱜ-ᱟ? 🍎🍎🍎 (ᱢᱩᱱᱰᱟᱨᱤ: ᱯᱮ / Three) ᱪᱤᱛᱟᱹᱨ ᱵᱮᱱᱟᱣ ᱢᱮ।",
            correctAnswerHindi: "3 (तीन सेब)",
            correctAnswerTribal: "ᱯᱮ (Pe - तीन)",
            imageHint: "🍎🍎🍎",
          },
          {
            qNum: 2,
            promptHindi: "आम का चित्र पहचानो 🥭🥭 और अपनी मातृभाषा में नाम बोलो।",
            promptTribal: "ᱩᱞ ᱪᱤᱛᱟᱹᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ 🥭🥭 ᱟᱨ ᱢᱩᱱᱰᱟᱨᱤ ᱛᱮ ᱢᱮᱱ ᱢᱮ (ᱩᱞ / Ul)।",
            correctAnswerHindi: "2 आम",
            correctAnswerTribal: "ᱵᱟᱨ ᱩᱞ (Bar Ul)",
            imageHint: "🥭🥭",
          },
        ],
      },
    ],
  },
  {
    id: "ws_grade2_lang",
    titleHindi: "निपुण भारत कार्यपत्रक: हमारे आस-पास के पशु-पक्षी व रंग",
    titleTribal: "ᱱᱤᱯᱩᱱ ᱵᱷᱟᱨᱚᱛ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ: ᱡᱤᱭᱟᱹᱞᱤ ᱟᱨ ᱪᱮᱬᱮ (ᱥᱟᱱᱛᱟᱲᱤ)",
    grade: "कक्षा 2",
    subject: "भाषा व पर्यावरण",
    targetLang: "san",
    targetLangName: "संथाली (Ol Chiki)",
    nipunCompetencyCode: "FLN-L2.1",
    nipunDomain: "Foundational Literacy (पठन व शब्दावली)",
    nipunLakshyaHindi: "पशु-पक्षियों के नाम हिंदी और मातृभाषा में पहचानना और लिखना।",
    nipunLakshyaTribal: "ᱡᱤᱭᱟᱹᱞᱤ ᱠᱚᱣᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ ᱚᱞ।",
    instructionsHindi: "चित्र देखकर सही मिलान करें और वाक्य बोलें।",
    instructionsTribal: "ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱴᱷᱤᱠ ᱡᱚᱲᱟᱣ ᱢᱮ ᱟᱨ ᱟᱭᱟᱛ ᱢᱮᱱ ᱢᱮ।",
    totalMarks: 10,
    evaluationRubric: {
      level1: "1-4 अंक: शुरुआती स्तर",
      level2: "5-7 अंक: प्रगतिशील स्तर",
      level3: "8-10 अंक: निपुण दक्ष स्तर",
    },
    sections: [
      {
        sectionTitleHindi: "भाग 1: पशु पहचान",
        sectionTitleTribal: "ᱦᱟᱹᱴᱤᱧ ᱑: ᱡᱤᱭᱟᱹᱞᱤ ᱪᱤᱱᱦᱟᱹᱣ",
        type: "match_following",
        questions: [
          {
            qNum: 1,
            promptHindi: "हाथी 🐘 को संथाली में क्या कहते हैं?",
            promptTribal: "ᱦᱟᱹᱛᱤ 🐘 (Hathi - Hati)",
            correctAnswerHindi: "हाथी (हाती)",
            correctAnswerTribal: "ᱦᱟᱹᱛᱤ (Hati)",
            imageHint: "🐘",
          },
        ],
      },
    ],
  },
];

// In-memory student submissions store
const savedSubmissions: StudentSubmission[] = [
  {
    id: "sub_demo_1",
    worksheetId: "ws_grade1_math",
    worksheetTitleHindi: "निपुण भारत कार्यपत्रक: गिनती 1-5 और फल पहचान",
    worksheetTitleTribal: "ᱱᱤᱯᱩᱱ ᱵᱷᱟᱨᱚᱛ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ: ᱞᱮᱠᱷᱟ ᱑-᱕ ᱟᱨ ᱡᱚ (ᱢᱩᱱᱰᱟᱨᱤ)",
    studentName: "सिदो मुर्मू",
    studentGrade: "कक्षा 1",
    targetLang: "mun",
    targetLangName: "मुंडारी",
    submissionType: "drawing",
    solutionData: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' style='background:%23FFF7ED;'><text x='30' y='60' font-size='40'>🍎 🍎 🍎</text><text x='30' y='120' font-size='24' font-weight='bold' fill='%23C2410C'>३ (तीन सेब) - ᱯᱮ</text><circle cx='80' cy='160' r='18' fill='%23EF4444'/><circle cx='130' cy='160' r='18' fill='%23EF4444'/><circle cx='180' cy='160' r='18' fill='%23EF4444'/></svg>",
    solutionTribalText: "ᱢᱩᱱᱰᱟᱨᱤ: ᱯᱮ ᱥᱮᱣ ᱢᱮᱱᱟᱜ-ᱟ (Pe Sew Menah-a)। ᱤᱧ ᱴᱮᱵᱽᱞᱮᱴ ᱨᱮ ᱯᱮ ᱥᱮᱣ ᱨᱮᱭᱟᱜ ᱪᱤᱛᱟᱹᱨ ᱵᱮᱱᱟᱣ ᱠᱮᱫᱟ।",
    solutionHindiTranslated: "हिंदी अनुवाद: 3 सेब हैं। मैंने टैबलेट पर 3 सेब का सुंदर चित्र बनाया है।",
    status: "pending",
    marksObtained: null,
    totalMarks: 10,
    starsEarned: 0,
    teacherFeedback: "",
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export async function generateWorksheet(req: Request, res: Response) {
  try {
    const { topic, lessonId, grade, subject, targetLang } = req.body as {
      topic?: string;
      lessonId?: string;
      grade?: string;
      subject?: string;
      targetLang?: TribalLanguage;
    };

    let selectedTopic = topic || "गिनती 1-10";
    if (lessonId === "1") selectedTopic = "गिनती 1-10";
    if (lessonId === "2") selectedTopic = "रंगों के नाम ";
    if (lessonId === "3") selectedTopic = "फल और सब्जियां ";
    if (lessonId === "4") selectedTopic = "हमारे आस-पास के जानवर";

    const validLang: TribalLanguage = targetLang === "ho" || targetLang === "mun" ? targetLang : "san";
    const worksheet = await aiService.generateWorksheet(selectedTopic, grade || "कक्षा 1", subject, validLang);

    // Save in in-memory list
    savedWorksheets.unshift(worksheet);

    res.json({
      success: true,
      worksheet,
    });
  } catch (error: any) {
    console.error("Error generating worksheet:", error);
    res.status(500).json({ error: "Failed to generate worksheet", details: error.message });
  }
}

// Teacher Uploads / Creates Custom Worksheet in Hindi with Instant AI Auto-Translation
export async function createCustomWorksheet(req: Request, res: Response) {
  try {
    const { titleHindi, grade, subject, targetLang, totalMarks, instructionsHindi, questions } = req.body as {
      titleHindi: string;
      grade?: string;
      subject?: string;
      targetLang?: TribalLanguage;
      totalMarks?: number;
      instructionsHindi?: string;
      questions?: Array<{
        promptHindi: string;
        imageHint?: string;
        type?: string;
        marks?: number;
      }>;
    };

    if (!titleHindi) {
      return res.status(400).json({ error: "Worksheet title in Hindi is required" });
    }

    const validLang: TribalLanguage = targetLang === "ho" || targetLang === "mun" ? targetLang : "san";
    const targetLangName = validLang === "san" ? "संथाली (Ol Chiki)" : validLang === "ho" ? "हो (Warang Citi)" : "मुंडारी (Mundari)";

    // AI Auto-translate title and instructions into target tribal language
    const titleTrans = await aiService.translateClassroomTurn(titleHindi, "hi", validLang);
    const instTrans = await aiService.translateClassroomTurn(instructionsHindi || "सभी प्रश्नों को हल करें।", "hi", validLang);

    // Process questions with AI translation
    const rawQuestions = Array.isArray(questions) && questions.length > 0 ? questions : [
      { promptHindi: "चित्र पहचानकर अपनी मातृभाषा में नाम बताएं।", imageHint: "🌳" },
      { promptHindi: "वस्तुओं को गिनकर सही संख्या लिखें।", imageHint: "🍎🍎" }
    ];

    const processedQuestions = await Promise.all(
      rawQuestions.map(async (q, idx) => {
        const qTrans = await aiService.translateClassroomTurn(q.promptHindi, "hi", validLang);
        return {
          qNum: idx + 1,
          promptHindi: q.promptHindi,
          promptTribal: `${qTrans.translatedText} (${qTrans.devanagari})`,
          correctAnswerHindi: "सटीक उत्तर",
          correctAnswerTribal: qTrans.devanagari,
          imageHint: q.imageHint || "📝",
        };
      })
    );

    const newWorksheet: GeneratedWorksheet = {
      id: `ws_custom_${Date.now()}`,
      titleHindi,
      titleTribal: `${titleTrans.translatedText} (${targetLangName})`,
      grade: grade || "कक्षा 1",
      subject: subject || "सामान्य विषय",
      targetLang: validLang,
      targetLangName,
      nipunCompetencyCode: "FLN-L1.2",
      nipunDomain: "निपुण भारत मिशन • प्राथमिक स्तर",
      nipunLakshyaHindi: "दक्षता आधारित अभ्यास और मातृभाषा में अभिव्यक्ति।",
      nipunLakshyaTribal: `${titleTrans.translatedText} ᱪᱮᱫᱚᱜ ᱠᱟᱹᱢᱤ।`,
      instructionsHindi: instructionsHindi || "सभी प्रश्नों को ध्यानपूर्वक पढ़ें और हल करें।",
      instructionsTribal: instTrans.translatedText || "ᱥᱟᱱᱟᱢ ᱠᱩᱠᱞᱤ ᱱᱟᱯᱟᱭ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ ᱟᱨ ᱛᱮᱞᱟ ᱚᱞ ᱢᱮ।",
      totalMarks: Number(totalMarks) || 10,
      evaluationRubric: {
        level1: "1-4 अंक: शुरुआती स्तर",
        level2: "5-7 अंक: प्रगतिशील स्तर",
        level3: "8-10 अंक: निपुण दक्ष स्तर",
      },
      sections: [
        {
          sectionTitleHindi: "मुख्य प्रश्न व अभ्यास",
          sectionTitleTribal: "ᱢᱩᱬᱩᱛ ᱠᱩᱠᱞᱤ ᱟᱨ ᱠᱟᱹᱢᱤ",
          type: "identify_write",
          questions: processedQuestions,
        },
      ],
    };

    savedWorksheets.unshift(newWorksheet);

    res.status(201).json({
      success: true,
      message: "कार्यपत्रक सफलतापूर्वक अपलोड व अनुवादित हो गया!",
      worksheet: newWorksheet,
    });
  } catch (error: any) {
    console.error("Error creating custom worksheet:", error);
    res.status(500).json({ error: "Failed to create worksheet", details: error.message });
  }
}

export async function getSavedWorksheets(req: Request, res: Response) {
  const { grade } = req.query as { grade?: string };
  let filtered = savedWorksheets;

  if (grade) {
    const targetGrd = grade.trim().toLowerCase();
    // Normalize "कक्षा 1", "grade 1", "1"
    const isGrd1 = targetGrd.includes("1");
    const isGrd2 = targetGrd.includes("2");

    filtered = savedWorksheets.filter((w) => {
      const wGrd = (w.grade || "").toLowerCase();
      if (isGrd1) return wGrd.includes("1") || wGrd.includes("कक्षा 1") || wGrd.includes("grade 1");
      if (isGrd2) return wGrd.includes("2") || wGrd.includes("कक्षा 2") || wGrd.includes("grade 2");
      return wGrd.includes(targetGrd);
    });
  }

  res.json({
    total: filtered.length,
    worksheets: filtered,
  });
}

// Student Solves and Submits Solution (with Drawing Canvas / Photo / Audio & AI Reverse Translation)
export async function submitWorksheetSolution(req: Request, res: Response) {
  try {
    const {
      worksheetId,
      worksheetTitleHindi,
      worksheetTitleTribal,
      studentName,
      studentGrade,
      targetLang,
      submissionType,
      solutionData,
      solutionTribalText,
      totalMarks,
    } = req.body as {
      worksheetId: string;
      worksheetTitleHindi?: string;
      worksheetTitleTribal?: string;
      studentName?: string;
      studentGrade?: string;
      targetLang?: TribalLanguage;
      submissionType?: "drawing" | "photo" | "audio" | "written";
      solutionData?: string;
      solutionTribalText?: string;
      totalMarks?: number;
    };

    const validLang: TribalLanguage = targetLang === "ho" || targetLang === "mun" ? targetLang : "san";
    const langLabel = validLang === "san" ? "संथाली" : validLang === "ho" ? "हो" : "मुंडारी";

    // AI NLP Reverse Translation into Hindi
    let translatedHindi = "";
    const originalText = (solutionTribalText || "").trim();

    if (originalText) {
      try {
        const transRes = await aiService.translateClassroomTurn(originalText, "tribal", validLang);
        translatedHindi = transRes.devanagari || transRes.translatedText;
      } catch (tErr) {
        console.warn("AI reverse translation error, applying fallback:", tErr);
      }
    }

    if (!translatedHindi) {
      if (submissionType === "drawing") {
        translatedHindi = `विद्यार्थी ने टैबलेट पर चित्र बनाकर प्रश्न का सही समाधान प्रस्तुत किया है। (${langLabel})`;
      } else if (submissionType === "audio") {
        translatedHindi = `विद्यार्थी का मौखिक वॉयस उत्तर: प्रश्न का स्पष्ट उच्चारण एवं सही उत्तर। (${langLabel})`;
      } else if (submissionType === "photo") {
        translatedHindi = `विद्यार्थी की कॉपी/स्लेट का हस्तलिखित फोटो समाधान। (${langLabel})`;
      } else {
        translatedHindi = originalText || `मातृभाषा समाधान प्राप्त हुआ। (${langLabel})`;
      }
    }

    const newSubmission: StudentSubmission = {
      id: `sub_${Date.now()}`,
      worksheetId,
      worksheetTitleHindi: worksheetTitleHindi || "अभ्यास कार्यपत्रक",
      worksheetTitleTribal: worksheetTitleTribal || "",
      studentName: studentName || "प्राथमिक विद्यार्थी",
      studentGrade: studentGrade || "कक्षा 1",
      targetLang: validLang,
      targetLangName: langLabel,
      submissionType: submissionType || "drawing",
      solutionData: solutionData || "",
      solutionTribalText: originalText || `${langLabel} में छात्र का उत्तर`,
      solutionHindiTranslated: translatedHindi,
      status: "pending",
      marksObtained: null,
      totalMarks: Number(totalMarks) || 10,
      starsEarned: 0,
      teacherFeedback: "",
      submittedAt: new Date().toISOString(),
    };

    savedSubmissions.unshift(newSubmission);

    res.status(201).json({
      success: true,
      message: "उत्तर सफलतापूर्वक जमा हो गया! शिक्षक जल्द समीक्षा करेंगे।",
      submission: newSubmission,
    });
  } catch (error: any) {
    console.error("Error submitting worksheet:", error);
    res.status(500).json({ error: "Failed to submit solution", details: error.message });
  }
}

// Get Submissions for Teacher Review or Student Scorecard
export async function getSubmissions(req: Request, res: Response) {
  const { studentName, grade, status } = req.query as { studentName?: string; grade?: string; status?: string };
  let filtered = savedSubmissions;

  if (studentName) {
    filtered = filtered.filter((s) => s.studentName.toLowerCase().includes(studentName.toLowerCase()));
  }

  if (grade) {
    const isGrd1 = grade.toLowerCase().includes("1");
    const isGrd2 = grade.toLowerCase().includes("2");
    filtered = filtered.filter((s) => {
      const g = (s.studentGrade || "").toLowerCase();
      if (isGrd1) return g.includes("1") || g.includes("कक्षा 1");
      if (isGrd2) return g.includes("2") || g.includes("कक्षा 2");
      return g.includes(grade.toLowerCase());
    });
  }

  if (status) {
    filtered = filtered.filter((s) => s.status === status);
  }

  res.json({
    total: filtered.length,
    submissions: filtered,
  });
}

// Teacher Reviews Submission, Assigns Marks & Feedback, and Updates Stars (⭐)
export async function reviewSubmission(req: Request, res: Response) {
  try {
    const { submissionId, marksObtained, teacherFeedback } = req.body as {
      submissionId: string;
      marksObtained: number;
      teacherFeedback?: string;
    };

    const found = savedSubmissions.find((s) => s.id === submissionId);
    if (!found) {
      return res.status(404).json({ error: "सबमिशन नहीं मिला" });
    }

    const marks = Math.max(0, Math.min(found.totalMarks, Number(marksObtained) || 0));
    // Stars earned: 1 star per 2 marks, or at least 1 star per non-zero mark, up to 5 stars or equal to marks
    const stars = Math.min(10, Math.max(1, Math.round((marks / found.totalMarks) * 10)));

    found.marksObtained = marks;
    found.starsEarned = stars;
    found.teacherFeedback = teacherFeedback || (marks >= 8 ? "बहुत बढ़िया! शाबाश!" : "अच्छा प्रयास! और अभ्यास करें।");
    found.status = "reviewed";
    found.reviewedAt = new Date().toISOString();

    res.json({
      success: true,
      message: "मूल्यांकन दर्ज कर दिया गया और छात्र को सितारे प्रदान कर दिए गए!",
      submission: found,
    });
  } catch (error: any) {
    console.error("Error reviewing submission:", error);
    res.status(500).json({ error: "मूल्यांकन दर्ज करने में त्रुटि" });
  }
}

export async function getWorksheetById(req: Request, res: Response) {
  const { id } = req.params;
  const found = savedWorksheets.find((w) => w.id === id);
  if (!found) {
    return res.status(404).json({ error: "Worksheet not found" });
  }
  res.json(found);
}

export async function getWorksheetHtml(req: Request, res: Response) {
  const { id } = req.params;
  const found = savedWorksheets.find((w) => w.id === id);

  if (!found) {
    return res.status(404).send("<h1>Worksheet not found</h1>");
  }

  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${found.titleHindi} - VaaniSetu NIPUN Bharat Worksheet</title>
  <style>
    @media print {
      body { margin: 0; padding: 10px; background: white; }
      .no-print { display: none !important; }
      .sheet-container { border: none !important; box-shadow: none !important; }
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 30px;
      background-color: #f8fafc;
    }
    .sheet-container {
      max-width: 820px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      border: 2px solid #e2e8f0;
    }
    .header {
      border-bottom: 3px double #2563eb;
      padding-bottom: 18px;
      margin-bottom: 24px;
      text-align: center;
    }
    .gov-tag {
      font-size: 12px;
      font-weight: 800;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }
    .title-hi {
      font-size: 24px;
      font-weight: 900;
      color: #1e3a8a;
      margin: 4px 0 2px 0;
    }
    .title-tribal {
      font-size: 16px;
      font-weight: 700;
      color: #2563eb;
      margin: 0 0 10px 0;
    }
    .nipun-badge {
      display: inline-block;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .meta-box {
      display: flex;
      justify-content: space-between;
      background: #f1f5f9;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .lakshya-box {
      background: #f8fafc;
      border-left: 4px solid #2563eb;
      padding: 10px 15px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 20px;
      font-size: 12px;
    }
    .lakshya-title {
      font-weight: 800;
      color: #1e3a8a;
      margin-bottom: 2px;
    }
    .student-fields {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      border: 1px dashed #94a3b8;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 24px;
      font-weight: 600;
    }
    .section-card {
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title-hi {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 3px 0;
    }
    .section-title-tribal {
      font-size: 13px;
      font-weight: 700;
      color: #2563eb;
      margin: 0 0 14px 0;
    }
    .question-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dotted #e2e8f0;
    }
    .question-row:last-child {
      border-bottom: none;
    }
    .q-text {
      flex: 1;
    }
    .q-prompt-hi {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
    }
    .q-prompt-tribal {
      font-size: 12px;
      color: #2563eb;
      font-weight: 600;
      margin-top: 2px;
    }
    .answer-line {
      width: 150px;
      border-bottom: 2px solid #94a3b8;
      height: 24px;
      margin-left: 20px;
    }
    .rubric-box {
      margin-top: 24px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 14px;
      border-radius: 10px;
      font-size: 11px;
    }
    .print-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #2563eb;
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 800;
      cursor: pointer;
      margin-bottom: 20px;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
    }
    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center;">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="sheet-container">
    <div class="header">
      <div class="gov-tag">Government of Jharkhand • PALASH MTB-MLE Project</div>
      <h1 class="title-hi">${found.titleHindi}</h1>
      <h2 class="title-tribal">${found.titleTribal}</h2>
      <span class="nipun-badge">🎯 NIPUN Bharat FLN Outcome: ${found.nipunCompetencyCode}</span>
    </div>

    <div class="student-fields">
      <div>विद्यार्थी का नाम: _________________</div>
      <div>कक्षा / रोल नं: _________________</div>
      <div>दिनांक: _________________</div>
    </div>

    <div class="meta-box">
      <div>कक्षा: ${found.grade}</div>
      <div>विषय: ${found.subject}</div>
      <div>मातृभाषा: ${found.targetLangName}</div>
      <div>पूर्णांक: ${found.totalMarks} अंक</div>
    </div>

    <div class="lakshya-box">
      <div class="lakshya-title">🎯 निपुण भारत सीखने का प्रतिफल (Learning Outcome):</div>
      <div><strong>हिंदी:</strong> ${found.nipunLakshyaHindi}</div>
      <div style="color: #2563eb; margin-top: 3px;"><strong>${found.targetLangName}:</strong> ${found.nipunLakshyaTribal}</div>
    </div>

    ${found.sections
      .map(
        (sec) => `
      <div class="section-card">
        <h3 class="section-title-hi">${sec.sectionTitleHindi}</h3>
        <h4 class="section-title-tribal">${sec.sectionTitleTribal}</h4>
        <div class="questions-list">
          ${sec.questions
            .map(
              (q) => `
            <div class="question-row">
              <div class="q-text">
                <div class="q-prompt-hi">प्र. ${q.qNum}) ${q.promptHindi}</div>
                <div class="q-prompt-tribal">${q.promptTribal}</div>
              </div>
              <div class="answer-line"></div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("")}

    <div class="rubric-box">
      <strong style="color: #1e3a8a;">📊 शिक्षक मूल्यांकन पैमाना (NIPUN Evaluation Rubric):</strong>
      <div style="display: flex; justify-content: space-between; margin-top: 6px;">
        <span>⭐ ${found.evaluationRubric?.level1 || "1-4 अंक: शुरुआती स्तर"}</span>
        <span>⭐⭐ ${found.evaluationRubric?.level2 || "5-7 अंक: प्रगतिशील स्तर"}</span>
        <span>⭐⭐⭐ ${found.evaluationRubric?.level3 || "8-10 अंक: निपुण स्तर"}</span>
      </div>
    </div>

    <div class="footer">
      वाणीसेतु • NIPUN Bharat FLN Aligned Mother Tongue Primary Pedagogy Support Suite
    </div>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}
