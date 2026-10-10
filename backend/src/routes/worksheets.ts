import { Router } from "express";
import {
  generateWorksheet,
  createCustomWorksheet,
  getSavedWorksheets,
  getWorksheetById,
  getWorksheetHtml,
  submitWorksheetSolution,
  getSubmissions,
  reviewSubmission,
} from "../controllers/worksheetController";

const router = Router();

router.post("/generate", generateWorksheet);
router.post("/custom", createCustomWorksheet);
router.get("/saved", getSavedWorksheets);
router.post("/submit", submitWorksheetSolution);
router.get("/submissions", getSubmissions);
router.post("/review", reviewSubmission);
router.get("/:id", getWorksheetById);
router.get("/:id/html", getWorksheetHtml);

export default router;
