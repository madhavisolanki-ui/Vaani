import { Request, Response } from "express";
import { aiService } from "../services/aiService";
import { TribalLanguage } from "../services/tribalKnowledgeBase";

export const FLASHCARD_CATEGORIES = [
  { id: "numbers", name: "गिनती 1 से 10", icon: "🔢", description: "संख्या ज्ञान 1 से 10 तक गिनती" },
  { id: "classroom_commands", name: "कक्षा के निर्देश", icon: "🏫", description: "कक्षा शिष्टाचार एवं निर्देश" },
  { id: "colors", name: "रंगों के नाम", icon: "🎨", description: "प्राथमिक और द्वितीयक रंग" },
  { id: "animals", name: "पशु-पक्षी एवं जानवर", icon: "🐾", description: "घरेलू व जंगली जानवर" },
  { id: "fruits_food", name: "फल और प्रकृति", icon: "🍎", description: "फल, पेड़, जल एवं घरेलू वस्तुएं" },
];

export async function getCategories(req: Request, res: Response) {
  res.json({
    categories: FLASHCARD_CATEGORIES,
  });
}

export async function generateFlashcards(req: Request, res: Response) {
  try {
    const { category, targetLang } = req.body as {
      category?: string;
      targetLang?: TribalLanguage;
    };

    const validCategory = category || "numbers";
    const validLang: TribalLanguage = targetLang === "ho" || targetLang === "mun" ? targetLang : "san";

    const deck = await aiService.generateFlashcards(validCategory, validLang);

    res.json({
      success: true,
      deck,
    });
  } catch (error: any) {
    console.error("Error generating flashcards:", error);
    res.status(500).json({ error: "Failed to generate flashcards", details: error.message });
  }
}

export async function getDeckByCategory(req: Request, res: Response) {
  try {
    const category = String(req.params.category || "numbers");
    const lang = (req.query.lang as TribalLanguage) || "san";
    const validLang: TribalLanguage = lang === "ho" || lang === "mun" ? lang : "san";

    const deck = await aiService.generateFlashcards(category, validLang);

    res.json({
      success: true,
      deck,
    });
  } catch (error: any) {
    console.error("Error fetching flashcards deck:", error);
    res.status(500).json({ error: "Failed to fetch flashcards deck", details: error.message });
  }
}
