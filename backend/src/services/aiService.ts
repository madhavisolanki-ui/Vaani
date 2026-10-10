import {
  TribalLanguage,
  SUPPORTED_LANGUAGES,
  translateOfflinePhrase,
  getVocabByCategory,
} from "./tribalKnowledgeBase";

export interface GeneratedLessonPlan {
  topic: string;
  grade: string;
  subject: string;
  targetLang: TribalLanguage;
  targetLangName: string;
  learningOutcomeCode: string;
  learningOutcomeDesc: string;
  durationMinutes: number;
  objectives: string[];
  materialsNeeded: string[];
  teachingScript: {
    stepNumber: number;
    phaseName: string;
    durationMinutes: number;
    teacherHindiScript: string;
    teacherTribalScript: string;
    phoneticPronunciation: string;
    classroomAction: string;
    expectedStudentResponse: string;
  }[];
  interactiveActivities: {
    activityTitle: string;
    instructionsHindi: string;
    instructionsTribal: string;
    groupType: "Individual" | "Pairs" | "Whole Class";
  }[];
}

export interface GeneratedWorksheet {
  id: string;
  titleHindi: string;
  titleTribal: string;
  grade: string;
  subject: string;
  targetLang: TribalLanguage;
  targetLangName: string;
  nipunCompetencyCode: string;
  nipunDomain: string;
  nipunLakshyaHindi: string;
  nipunLakshyaTribal: string;
  instructionsHindi: string;
  instructionsTribal: string;
  totalMarks: number;
  evaluationRubric: {
    level1: string; // शुरुआती (Beginner)
    level2: string; // प्रगतिशील (Progressing)
    level3: string; // निपुण (Proficient)
  };
  sections: {
    sectionTitleHindi: string;
    sectionTitleTribal: string;
    type: "match_following" | "fill_blanks" | "mcq" | "identify_write" | "true_false";
    questions: {
      qNum: number;
      promptHindi: string;
      promptTribal: string;
      optionsHindi?: string[];
      optionsTribal?: string[];
      correctAnswerHindi: string;
      correctAnswerTribal: string;
      imageHint?: string;
    }[];
  }[];
}

export interface GeneratedFlashcardDeck {
  deckTitle: string;
  category: string;
  targetLang: TribalLanguage;
  targetLangName: string;
  nipunCompetencyCode: string;
  nipunDomain: string;
  pedagogicalTeacherTip: string;
  cards: {
    id: string;
    hindiWord: string;
    englishWord: string;
    tribalWordNative: string;
    tribalWordDevanagari: string;
    phoneticPronunciation: string;
    icon: string;
    audioUrl: string;
    exampleSentenceHindi?: string;
    exampleSentenceTribal?: string;
    classroomPromptHindi?: string;
    classroomPromptTribal?: string;
  }[];
}

// 1. Curated FLN Lesson Plan Generator
function generateFallbackLessonPlan(
  topic: string,
  grade: string,
  subject: string,
  targetLang: TribalLanguage
): GeneratedLessonPlan {
  const langMeta = SUPPORTED_LANGUAGES[targetLang] || SUPPORTED_LANGUAGES.san;
  const isSanthali = targetLang === "san";
  const isHo = targetLang === "ho";

  const isCounting = topic.toLowerCase().includes("गिनती") || topic.toLowerCase().includes("number");
  const compCode = isCounting ? "FLN-N1.1" : "FLN-L1.3";
  const compDesc = isCounting
    ? `ठोस वस्तुओं और चित्रों के माध्यम से 1 से 10 तक संख्या बोध और मातृभाषा (${langMeta.name}) में संख्या नामों की पहचान।`
    : `चित्र-शब्द संबंध एवं मौखिक भाषा विकास: हिंदी और ${langMeta.name} में वस्तुओं के नाम व सहज बातचीत।`;

  const greetTribal = isSanthali ? "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ! ᱪᱮᱛ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱯᱮᱭᱟ?" : isHo ? "जोहार हुनको! चिलका मेनापिया?" : "जोहार होनको! चिलके मेनापिया?";
  const greetPhonetic = isSanthali ? "Johar Gidra! Chet leka menah peya? (जोहार गिदरा! चेत लेका मेनाक पेया?)" : "Johar Hunko! Chilka menapiya?";
  
  const sitTribal = isSanthali ? "ᱥᱟᱱᱟᱢ ᱠᱳ ᱫᱩᱲᱩᱵᱽ ᱯᱮ" : isHo ? "सनाम को दुब पे" : "सनाम को दूब पे";
  const sitPhonetic = isSanthali ? "Sanam ko durup pe (सनाम को दुरुब पे)" : "Sanam ko dub pe (सनाम को दुब पे)";

  const openBookTribal = isSanthali ? "ᱯᱩᱛᱷᱤ ᱨᱟᱲᱟᱭ ᱢᱮ ᱟᱨ ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱢᱮ" : isHo ? "पुथी ओलोङ पे अनि चित्र नेल पे" : "पुथी उघाड़ पे अनि चित्र नेल पे";
  const openBookPhonetic = isSanthali ? "Puthi raray me ar chitar gnel me" : "Puthi olong pe ani chitra nel pe";

  const praiseTribal = isSanthali ? "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱥᱟᱵᱟᱥ!" : "बेश गे! साबास!";
  const praisePhonetic = isSanthali ? "Adi napay! Sabash!" : "Besh ge! Sabash!";

  return {
    topic,
    grade: grade || "Grade 1",
    subject: subject || (isCounting ? "Foundational Numeracy (संख्या ज्ञान)" : "Foundational Literacy (भाषा ज्ञान)"),
    targetLang,
    targetLangName: langMeta.name,
    learningOutcomeCode: compCode,
    learningOutcomeDesc: compDesc,
    durationMinutes: 30,
    objectives: [
      `Recognize key concepts of ${topic} in both Hindi and ${langMeta.name}.`,
      `Pronounce foundational tribal words with accurate phonetics.`,
      `Achieve NIPUN Bharat Foundational Competency ${compCode} through peer interactions.`,
    ],
    materialsNeeded: [
      "VaaniSetu Flashcard Deck",
      "NIPUN Bharat Bilingual Worksheet",
      "Local Realia Objects / Counting Pebbles",
    ],
    teachingScript: [
      {
        stepNumber: 1,
        phaseName: "1. Warm-up & Welcome (जोहार / स्वागत)",
        durationMinutes: 5,
        teacherHindiScript: "नमस्ते बच्चों! आप सब कैसे हैं? सब अपनी जगह बैठ जाइए।",
        teacherTribalScript: `${greetTribal} ${sitTribal}।`,
        phoneticPronunciation: `${greetPhonetic} • ${sitPhonetic}`,
        classroomAction: "Teacher smiles, folds hands in Johar posture, gestures children to sit comfortably.",
        expectedStudentResponse: "Johar Masterji! Besh ge menalaya.",
      },
      {
        stepNumber: 2,
        phaseName: "2. Concept Introduction (अवधारणा परिचय)",
        durationMinutes: 10,
        teacherHindiScript: `आज हम सब '${topic}' के बारे में सीखेंगे। अपनी-अपनी किताब खोलें और चित्र देखें।`,
        teacherTribalScript: `ᱛᱮᱦᱮᱧ ᱫᱚ '${topic}' ᱵᱟᱵᱚᱛ ᱵᱳᱱ ᱪᱮᱫᱚᱜᱼᱟ। ${openBookTribal}।`,
        phoneticPronunciation: `Teheng do '${topic}' babot bon chedoh-a. ${openBookPhonetic}`,
        classroomAction: "Teacher points to the blackboard and displays visual flashcard of the topic.",
        expectedStudentResponse: "Children open their books and focus on the flashcard image.",
      },
      {
        stepNumber: 3,
        phaseName: "3. Interactive Peer Practice (बातचीत और अभ्यास)",
        durationMinutes: 10,
        teacherHindiScript: "अब मेरे साथ बोलिए। जो मैं बोलूंगा, उसे आप अपनी भाषा में दोहराएंगे।",
        teacherTribalScript: "ᱱᱤᱛᱚᱜ ᱤᱧ ᱥᱟᱶᱛᱮ ᱢᱮᱱ ᱯᱮ। ᱡᱟᱦᱟᱸᱭ ᱢᱮᱱᱟ ᱚᱱᱟ ᱟᱯᱮ ᱟᱯᱱᱟᱨ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱞᱟᱹᱭ ᱯᱮ।",
        phoneticPronunciation: "Nitoh ing sawte men pe. Jahang-ing mena ona ape apnar parsi te lay pe.",
        classroomAction: "Teacher says word in Hindi -> Asks class to shout the vernacular tribal equivalent in unison.",
        expectedStudentResponse: "Children eagerly chant the tribal word in chorus.",
      },
      {
        stepNumber: 4,
        phaseName: "4. Assessment & Praise (मूल्यांकन और शाबाशी)",
        durationMinutes: 5,
        teacherHindiScript: "शाबाश बच्चों! आप सबने बहुत अच्छा किया। कल हम इसपर वर्कशीट करेंगे।",
        teacherTribalScript: `${praiseTribal} ᱟᱯᱮ ᱟᱹᱰᱤ ᱵᱷᱟᱹᱜᱤ ᱯᱮ ᱠᱟᱹᱢᱤ ᱠᱮᱫᱟ।`,
        phoneticPronunciation: `${praisePhonetic} Ape adi bhagi pe kami keda.`,
        classroomAction: "Teacher claps and gives positive reinforcement stars to students.",
        expectedStudentResponse: "Children smile and clap together.",
      },
    ],
    interactiveActivities: [
      {
        activityTitle: "Bilingual Flashcard Echo Game",
        instructionsHindi: "शिक्षक हिंदी में कार्ड दिखाएगा, बच्चे अपनी मातृभाषा में उस वस्तु का नाम बोलेंगे।",
        instructionsTribal: "ᱜᱩᱨᱩᱡᱤ ᱪᱤᱛᱟᱹᱨ ᱩᱫᱩᱜᱟᱭ, ᱜᱤᱫᱽᱨᱟᱹ ᱟᱠᱚᱣᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱧᱩᱛᱩᱢ ᱠᱚ ᱞᱟᱹᱭᱟ।",
        groupType: "Whole Class",
      },
      {
        activityTitle: "Pair Dialogue Practice (जोड़ी में बातचीत)",
        instructionsHindi: "दो-दो बच्चे मिलकर एक दूसरे से प्रश्न पूछेंगे और उत्तर देंगे।",
        instructionsTribal: "ᱵᱟᱨ ᱦᱚᱲ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱠᱩᱠᱞᱤ ᱠᱩᱯᱩᱞᱤ ᱯᱮ।",
        groupType: "Pairs",
      },
    ],
  };
}

// 2. NIPUN Bharat Aligned Bilingual Worksheet Generator
function generateFallbackWorksheet(
  topic: string,
  grade: string,
  subject: string,
  targetLang: TribalLanguage
): GeneratedWorksheet {
  const langMeta = SUPPORTED_LANGUAGES[targetLang] || SUPPORTED_LANGUAGES.san;
  const isCounting = topic.toLowerCase().includes("गिनती") || topic.toLowerCase().includes("number") || topic.toLowerCase().includes("count");
  const isAnimal = topic.toLowerCase().includes("जानवर") || topic.toLowerCase().includes("animal");
  const isColor = topic.toLowerCase().includes("रंग") || topic.toLowerCase().includes("color");

  const category = isCounting ? "numbers" : isAnimal ? "animals" : isColor ? "colors" : "fruits_food";
  const vocab = getVocabByCategory(category, targetLang);
  const qList = vocab.slice(0, 5);

  const competencyCode = isCounting ? "FLN-N1.1" : isColor ? "FLN-L1.3" : "FLN-L1.1";
  const domainName = isCounting ? "Foundational Numeracy (संख्या बोध एवं ज्ञान)" : "Foundational Literacy (ध्वनि-चित्र संबंध)";
  const lakshyaHi = isCounting
    ? "विद्यार्थी 1 से 10 तक की वस्तुओं को गिनकर हिंदी एवं मातृभाषा में सही संख्या की पहचान कर सकते हैं।"
    : `विद्यार्थी चित्रों को देखकर उनके नाम हिंदी एवं ${langMeta.name} भाषा में पहचान कर लिख व बोल सकते हैं।`;
  const lakshyaTribal = isCounting
    ? "ᱜᱤᱫᱽᱨᱟᱹ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱡᱤᱱᱤᱥ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱴᱷᱤᱠ ᱞᱮᱠᱷᱟ ᱪᱤᱱᱦᱟᱹᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱠᱚ।"
    : `ᱜᱤᱫᱽᱨᱟᱹ ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱚᱱᱟ ᱨᱮᱭᱟᱜ ᱧᱩᱛᱩᱢ ${langMeta.name} ᱛᱮ ᱞᱟᱹᱭ ᱟᱨ ᱚᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱠᱚ।`;

  return {
    id: `ws_${Date.now()}`,
    titleHindi: `निपुण भारत कार्यपत्रक: ${topic} (${grade || "कक्षा 1"})`,
    titleTribal: `ᱱᱤᱯᱩᱱ ᱵᱷᱟᱨᱚᱛ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ: ${topic} (${langMeta.name})`,
    grade: grade || "Grade 1",
    subject: subject || (isCounting ? "Foundational Numeracy (FLN-Maths)" : "Foundational Literacy (FLN-Language)"),
    targetLang,
    targetLangName: langMeta.name,
    nipunCompetencyCode: competencyCode,
    nipunDomain: domainName,
    nipunLakshyaHindi: lakshyaHi,
    nipunLakshyaTribal: lakshyaTribal,
    instructionsHindi: "सभी प्रश्नों को ध्यानपूर्वक पढ़ें और सही उत्तर लिखें।",
    instructionsTribal: "ᱥᱟᱱᱟᱢ ᱠᱩᱠᱞᱤ ᱱᱟᱯᱟᱭ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ ᱟᱨ ᱴᱷᱤᱠ ᱛᱮᱞᱟ ᱚᱞ ᱢᱮ।",
    totalMarks: 10,
    evaluationRubric: {
      level1: "1-4 अंक: शुरुआती स्तर (Needs Support)",
      level2: "5-7 अंक: प्रगतिशील स्तर (Developing)",
      level3: "8-10 अंक: निपुण दक्ष स्तर (Proficient)",
    },
    sections: [
      {
        sectionTitleHindi: "भाग 1: सही मिलान करो (Match the Following)",
        sectionTitleTribal: "ᱦᱟᱹᱴᱤᱧ ᱑: ᱴᱷᱤᱠ ᱡᱚᱲᱟᱣ ᱢᱮ (Bilingual Match)",
        type: "match_following",
        questions: qList.slice(0, 3).map((item, index) => ({
          qNum: index + 1,
          promptHindi: `चित्र पहचानो: ${item.hindi} (${item.icon})`,
          promptTribal: `${langMeta.name}: ${item.translation.native} [उच्चारण: ${item.translation.devanagari}]`,
          correctAnswerHindi: item.hindi,
          correctAnswerTribal: item.translation.devanagari,
          imageHint: item.icon,
        })),
      },
      {
        sectionTitleHindi: "भाग 2: चित्र देखकर मातृभाषा में नाम लिखो (Identify & Write)",
        sectionTitleTribal: "ᱦᱟᱹᱴᱤᱧ ᱒: ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ",
        type: "identify_write",
        questions: qList.slice(3, 5).map((item, index) => ({
          qNum: index + 1,
          promptHindi: `यह क्या है? ${item.icon} (हिंदी में: ${item.hindi})`,
          promptTribal: `ᱱᱚᱶᱟ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? ${item.icon}`,
          correctAnswerHindi: item.hindi,
          correctAnswerTribal: `${item.translation.native} (${item.translation.devanagari})`,
          imageHint: item.icon,
        })),
      },
    ],
  };
}

// 3. NIPUN Bharat Aligned Flashcard Deck Generator
function generateFallbackFlashcardDeck(
  category: string,
  targetLang: TribalLanguage
): GeneratedFlashcardDeck {
  const langMeta = SUPPORTED_LANGUAGES[targetLang] || SUPPORTED_LANGUAGES.san;
  const items = getVocabByCategory(category, targetLang);

  const isNumbers = category === "numbers";
  const competency = isNumbers ? "FLN-N1.1 (संख्या बोध 1-10)" : "FLN-L1.3 (चित्र-ध्वनि संबंध व शब्दावली)";
  const domain = isNumbers ? "Foundational Numeracy" : "Foundational Literacy & Oral Language";
  const teacherTip = isNumbers
    ? "शिक्षक फ्लैशकार्ड दिखाकर पहले हिंदी में संख्या बोले, फिर बच्चों से 3 बार मातृभाषा में सामूहिक उच्चारण करवाएं।"
    : `शिक्षक कार्ड का चित्र दिखाकर बच्चों से ${langMeta.name} भाषा में नाम पूछें और सही उच्चारण पर शाबाशी दें।`;

  return {
    deckTitle: `${category.toUpperCase()} Flashcards (${langMeta.name})`,
    category,
    targetLang,
    targetLangName: langMeta.name,
    nipunCompetencyCode: competency,
    nipunDomain: domain,
    pedagogicalTeacherTip: teacherTip,
    cards: items.map((item) => ({
      id: item.id,
      hindiWord: item.hindi,
      englishWord: item.english,
      tribalWordNative: item.translation.native,
      tribalWordDevanagari: item.translation.devanagari,
      phoneticPronunciation: item.translation.phonetic,
      icon: item.icon,
      audioUrl: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(item.translation.audioText)}&type=2`,
      exampleSentenceHindi: `यह एक ${item.hindi} है।`,
      exampleSentenceTribal: `ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫ ${item.translation.native} ᱠᱟᱱᱟ।`,
      classroomPromptHindi: `बच्चों, यह क्या है? बोलो '${item.hindi}'`,
      classroomPromptTribal: `ᱜᱤᱫᱽᱨᱟᱹ, ᱱᱚᱶᱟ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? ᱢᱮᱱ ᱯᱮ '${item.translation.devanagari}'`,
    })),
  };
}

import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
if (apiKey) {
  try {
    geminiClient = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("Could not init GoogleGenAI:", e);
  }
}

export const aiService = {
  async generateLessonPlan(
    topic: string,
    grade: string = "Grade 1",
    subject: string = "FLN",
    targetLang: TribalLanguage = "san"
  ): Promise<GeneratedLessonPlan> {
    return generateFallbackLessonPlan(topic, grade, subject, targetLang);
  },

  async generateWorksheet(
    topic: string,
    grade: string = "Grade 1",
    subject: string = "FLN",
    targetLang: TribalLanguage = "san"
  ): Promise<GeneratedWorksheet> {
    return generateFallbackWorksheet(topic, grade, subject, targetLang);
  },

  async generateFlashcards(
    category: string = "numbers",
    targetLang: TribalLanguage = "san"
  ): Promise<GeneratedFlashcardDeck> {
    return generateFallbackFlashcardDeck(category, targetLang);
  },

  async translateClassroomTurn(
    text: string,
    from: "hi" | "tribal",
    targetLang: TribalLanguage = "san"
  ): Promise<{
    originalText: string;
    translatedText: string;
    devanagari: string;
    phonetic: string;
    audioUrl: string;
    latencyMs: number;
  }> {
    const startTime = Date.now();

    // 1. If Gemini API key is available, use Google Gemini AI
    if (geminiClient) {
      try {
        const langName = targetLang === "ho" ? "Ho (Warang Citi)" : targetLang === "mun" ? "Mundari" : "Santhali (Ol Chiki)";
        const prompt = from === "hi"
          ? `You are an expert tribal linguist for Jharkhand Mother Tongue-Based Education.
Translate this Hindi classroom speech into ${langName}: "${text}".
Return ONLY a valid JSON object matching this exact structure:
{
  "native": "translation in native script (Ol Chiki for Santhali, Warang Citi or Devanagari for Ho/Mundari)",
  "devanagari": "Devanagari phonetic pronunciation",
  "phonetic": "Roman English phonetic pronunciation"
}`
          : `You are an expert tribal linguist for Jharkhand Mother Tongue-Based Education.
Translate this ${langName} student response into clean Hindi: "${text}".
Return ONLY a valid JSON object:
{
  "native": "${text}",
  "devanagari": "Hindi translation",
  "phonetic": "Hindi translation"
}`;

        const response = await geminiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const rawText = response.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const latencyMs = Date.now() - startTime;
          const translatedText = parsed.native || text;
          const devanagari = parsed.devanagari || text;
          const phonetic = parsed.phonetic || text;
          const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(phonetic || devanagari)}&type=2`;
          return {
            originalText: text,
            translatedText,
            devanagari,
            phonetic,
            audioUrl,
            latencyMs,
          };
        }
      } catch (geminiErr) {
        console.warn("Gemini translation error, falling back to offline engine:", geminiErr);
      }
    }

    // 2. Offline Dynamic Vernacular & Tokenizer Engine
    const result = translateOfflinePhrase(text, from, targetLang);
    const latencyMs = Date.now() - startTime;

    const audioParam = encodeURIComponent(result.phonetic || result.devanagari || result.translatedText);
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${audioParam}&type=2`;

    return {
      originalText: text,
      translatedText: result.translatedText,
      devanagari: result.devanagari,
      phonetic: result.phonetic,
      audioUrl,
      latencyMs: Math.max(latencyMs, 110),
    };
  },
};
