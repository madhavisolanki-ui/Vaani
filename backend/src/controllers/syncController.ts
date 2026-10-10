import { Request, Response } from "express";
import {
  SUPPORTED_LANGUAGES,
  TRIBAL_VOCABULARY,
  TribalLanguage,
} from "../services/tribalKnowledgeBase";
import {
  NIPUN_BHARAT_COMPETENCIES,
  FLN_TOPICS,
} from "./curriculumController";
import { FLASHCARD_CATEGORIES } from "./flashcardController";
import { aiService } from "../services/aiService";

export async function getOfflinePack(req: Request, res: Response) {
  try {
    const lang = (req.query.lang as TribalLanguage) || "san";
    const targetLang: TribalLanguage = lang === "ho" || lang === "mun" ? lang : "san";

    // Generate starter lesson plans for offline bundle
    const offlineLessons = await Promise.all(
      FLN_TOPICS.slice(0, 3).map((topic) =>
        aiService.generateLessonPlan(topic.name, topic.grade, topic.subject, targetLang)
      )
    );

    // Generate starter worksheets for offline bundle
    const offlineWorksheets = await Promise.all(
      FLN_TOPICS.slice(0, 3).map((topic) =>
        aiService.generateWorksheet(topic.name, topic.grade, topic.subject, targetLang)
      )
    );

    // Generate flashcards for offline bundle
    const offlineFlashcards = await Promise.all(
      FLASHCARD_CATEGORIES.slice(0, 3).map((cat) =>
        aiService.generateFlashcards(cat.id, targetLang)
      )
    );

    const offlinePack = {
      manifest: {
        bundleVersion: "1.0.0-FLN-OFFLINE",
        generatedAt: new Date().toISOString(),
        targetLanguage: SUPPORTED_LANGUAGES[targetLang],
        supportedLanguages: SUPPORTED_LANGUAGES,
        totalLessons: offlineLessons.length,
        totalWorksheets: offlineWorksheets.length,
        totalFlashcards: offlineFlashcards.reduce((acc, d) => acc + d.cards.length, 0),
        totalVocabWords: TRIBAL_VOCABULARY.length,
        tabletCompatibility: "Android 9+ / <=2GB RAM Optimised",
      },
      curriculum: {
        competencies: NIPUN_BHARAT_COMPETENCIES,
        topics: FLN_TOPICS,
        lessonPlans: offlineLessons,
      },
      worksheets: offlineWorksheets,
      flashcardDecks: offlineFlashcards,
      vocabularyDictionary: TRIBAL_VOCABULARY,
    };

    res.json(offlinePack);
  } catch (error: any) {
    console.error("Error creating offline sync pack:", error);
    res.status(500).json({ error: "Failed to create offline sync pack", details: error.message });
  }
}

export async function getSyncStatus(req: Request, res: Response) {
  res.json({
    serverOnline: true,
    latestBundleVersion: "1.0.0-FLN-OFFLINE",
    lastUpdated: new Date().toISOString(),
    supportedLanguages: Object.keys(SUPPORTED_LANGUAGES),
  });
}
