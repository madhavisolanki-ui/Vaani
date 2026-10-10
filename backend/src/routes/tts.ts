import { Router } from "express";
import { tts } from "../controllers/ttsController";

const router = Router();

router.post("/", tts);

export default router;