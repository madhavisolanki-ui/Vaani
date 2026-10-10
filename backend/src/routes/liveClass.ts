import { Router } from "express";
import {
  getQuickPhrases,
  translateSpeechTurn,
  getSessionHistory,
  clearSessionHistory,
} from "../controllers/liveClassController";

const router = Router();

router.get("/quick-phrases", getQuickPhrases);
router.post("/translate-speech", translateSpeechTurn);
router.get("/history", getSessionHistory);
router.get("/session", getSessionHistory);
router.post("/clear", clearSessionHistory);

export default router;
