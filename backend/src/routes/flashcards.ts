import { Router } from "express";
import {
  getCategories,
  generateFlashcards,
  getDeckByCategory,
} from "../controllers/flashcardController";

const router = Router();

router.get("/categories", getCategories);
router.post("/generate", generateFlashcards);
router.get("/deck/:category", getDeckByCategory);
router.get("/:category", getDeckByCategory);

export default router;
