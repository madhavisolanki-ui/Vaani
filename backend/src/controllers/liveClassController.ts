import { Request, Response } from "express";
import { aiService } from "../services/aiService";
import {
  TribalLanguage,
  SUPPORTED_LANGUAGES,
  getVocabByCategory,
} from "../services/tribalKnowledgeBase";

export interface LiveTurn {
  id: string;
  senderRole: "teacher" | "student";
  senderName: string;
  originalText: string;
  hindiText: string;
  translations: {
    san: { native: string; devanagari: string; phonetic: string; audioUrl: string };
    ho: { native: string; devanagari: string; phonetic: string; audioUrl: string };
    mun: { native: string; devanagari: string; phonetic: string; audioUrl: string };
  };
  latencyMs: number;
  timestamp: string;
}

const activeLiveSession: LiveTurn[] = [
  {
    id: "init_1",
    senderRole: "teacher",
    senderName: "Madhavi (Teacher)",
    originalText: "नमस्ते बच्चों, आज हम 1 से 10 तक गिनती सीखेंगे। सब लोग ध्यान से सुनें।",
    hindiText: "नमस्ते बच्चों, आज हम 1 से 10 तक गिनती सीखेंगे। सब लोग ध्यान से सुनें।",
    translations: {
      san: {
        native: "ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ, ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ।",
        devanagari: "गिदरा को, तेहेंज आबो १ खोन १० धाबिज लेखा बोन चेदोग-आ।",
        phonetic: "Gidra ko, tehenj abo 1 khon 10 dhabij lekha bon chedog-a",
        audioUrl: "https://dict.youdao.com/dictvoice?audio=Gidra+ko+tehenj+abo+1+khon+10+dhabij+lekha+bon+chedog-a&type=2",
      },
      ho: {
        native: "ᱦᱳ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱳ, ᱛᱤᱥᱤᱝ ᱑ ᱮᱛᱮ ᱑᱐ ᱞᱮᱠᱷᱟ ᱤᱛᱩ-ᱱᱟ।",
        devanagari: "हो गिदरा को, तिसिंग १ एते १० लेखा इतु-ना।",
        phonetic: "Ho gidra ko, tising 1 ete 10 lekha itu-na",
        audioUrl: "https://dict.youdao.com/dictvoice?audio=Ho+gidra+ko+tising+1+ete+10+lekha+itu-na&type=2",
      },
      mun: {
        native: "ᱦᱚᱸ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ, ᱛᱤᱧ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱞᱮᱠᱷᱟ ᱥᱮᱬᱟ ᱮᱭᱟ।",
        devanagari: "हों गिदरा को, तिंय १ खोन १० लेखा सेणा एया।",
        phonetic: "Hon gidra ko, tiny 1 khon 10 lekha sena eya",
        audioUrl: "https://dict.youdao.com/dictvoice?audio=Hon+gidra+ko+tiny+1+khon+10+lekha+sena+eya&type=2",
      },
    },
    latencyMs: 110,
    timestamp: "09:30 AM",
  },
];

export async function getQuickPhrases(req: Request, res: Response) {
  const lang = (req.query.lang as TribalLanguage) || "san";
  const validLang: TribalLanguage = lang === "ho" || lang === "mun" ? lang : "san";

  const phrases = getVocabByCategory("classroom_commands", validLang);

  res.json({
    lang: validLang,
    langMeta: SUPPORTED_LANGUAGES[validLang],
    phrases: phrases.map((p) => ({
      id: p.id,
      hindi: p.hindi,
      english: p.english,
      icon: p.icon,
      native: p.translation.native,
      devanagari: p.translation.devanagari,
      phonetic: p.translation.phonetic,
      audioUrl: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(p.translation.audioText)}&type=2`,
    })),
  });
}

export async function translateSpeechTurn(req: Request, res: Response) {
  try {
    const { text, from, targetLang, role, senderName } = req.body as {
      text: string;
      from?: "hi" | "san" | "ho" | "mun";
      targetLang?: TribalLanguage;
      role?: "teacher" | "student";
      senderName?: string;
    };

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required for translation" });
    }

    const senderRole = role || (from === "hi" || !from ? "teacher" : "student");
    const name = senderName || (senderRole === "teacher" ? "Teacher (शिक्षक)" : "Student (छात्र)");
    const nowTime = new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" });

    let hindiText = text;
    let transSan = { native: text, devanagari: text, phonetic: text, audioUrl: "" };
    let transHo = { native: text, devanagari: text, phonetic: text, audioUrl: "" };
    let transMun = { native: text, devanagari: text, phonetic: text, audioUrl: "" };

    if (senderRole === "teacher") {
      // Teacher sends in Hindi -> generate translations for san, ho, and mun
      const [resSan, resHo, resMun] = await Promise.all([
        aiService.translateClassroomTurn(text, "hi", "san"),
        aiService.translateClassroomTurn(text, "hi", "ho"),
        aiService.translateClassroomTurn(text, "hi", "mun"),
      ]);

      transSan = { native: resSan.translatedText, devanagari: resSan.devanagari, phonetic: resSan.phonetic, audioUrl: resSan.audioUrl };
      transHo = { native: resHo.translatedText, devanagari: resHo.devanagari, phonetic: resHo.phonetic, audioUrl: resHo.audioUrl };
      transMun = { native: resMun.translatedText, devanagari: resMun.devanagari, phonetic: resMun.phonetic, audioUrl: resMun.audioUrl };
    } else {
      // Student sends in tribal or spoken Hindi -> translate to Hindi for teacher, and ensure native tribal for student
      const studentLang: TribalLanguage = (from === "ho" || from === "mun") ? from : "san";
      const containsOlChiki = /[\u1C50-\u1C7F]/.test(text);

      if (containsOlChiki) {
        // Native Ol Chiki input -> translate to Hindi
        const resHi = await aiService.translateClassroomTurn(text, "tribal", studentLang);
        hindiText = resHi.translatedText;
        const resAudio = resHi.audioUrl;
        transSan = { native: text, devanagari: resHi.devanagari || text, phonetic: resHi.phonetic || text, audioUrl: resAudio };
        transHo = { native: text, devanagari: resHi.devanagari || text, phonetic: resHi.phonetic || text, audioUrl: resAudio };
        transMun = { native: text, devanagari: resHi.devanagari || text, phonetic: resHi.phonetic || text, audioUrl: resAudio };
      } else {
        // Hindi or Roman speech input -> convert to tribal scripts for student, keep Hindi for teacher
        const [resSan, resHo, resMun] = await Promise.all([
          aiService.translateClassroomTurn(text, "hi", "san"),
          aiService.translateClassroomTurn(text, "hi", "ho"),
          aiService.translateClassroomTurn(text, "hi", "mun"),
        ]);
        hindiText = text;
        transSan = { native: resSan.translatedText, devanagari: resSan.devanagari, phonetic: resSan.phonetic, audioUrl: resSan.audioUrl };
        transHo = { native: resHo.translatedText, devanagari: resHo.devanagari, phonetic: resHo.phonetic, audioUrl: resHo.audioUrl };
        transMun = { native: resMun.translatedText, devanagari: resMun.devanagari, phonetic: resMun.phonetic, audioUrl: resMun.audioUrl };
      }
    }

    const newTurn: LiveTurn = {
      id: `turn_${Date.now()}`,
      senderRole,
      senderName: name,
      originalText: text,
      hindiText,
      translations: {
        san: transSan,
        ho: transHo,
        mun: transMun,
      },
      latencyMs: 125,
      timestamp: nowTime,
    };

    activeLiveSession.push(newTurn);
    if (activeLiveSession.length > 50) {
      activeLiveSession.shift();
    }

    res.json({
      success: true,
      data: newTurn,
      turns: activeLiveSession,
    });
  } catch (error: any) {
    console.error("Error in live translation turn:", error);
    res.status(500).json({ error: "Live translation failed", details: error.message });
  }
}

export async function getSessionHistory(req: Request, res: Response) {
  const lang = (req.query.lang as TribalLanguage) || "san";
  const validLang: TribalLanguage = lang === "ho" || lang === "mun" ? lang : "san";

  res.json({
    totalTurns: activeLiveSession.length,
    turns: activeLiveSession.map((t) => {
      const studentTrans = t.translations[validLang] || t.translations.san;
      return {
        id: t.id,
        senderRole: t.senderRole,
        senderName: t.senderName,
        originalText: t.originalText,
        hindiText: t.hindiText,
        studentViewText: studentTrans.native || t.originalText,
        studentViewDevanagari: studentTrans.devanagari,
        studentViewPhonetic: studentTrans.phonetic,
        audioUrl: studentTrans.audioUrl,
        latencyMs: t.latencyMs,
        timestamp: t.timestamp,
      };
    }),
  });
}

export async function clearSessionHistory(req: Request, res: Response) {
  activeLiveSession.length = 0;
  res.json({ success: true, message: "Session history cleared" });
}
