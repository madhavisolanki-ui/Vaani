import { Router } from "express";
import {
  getCompetencies,
  getTopics,
  generateLessonPlan,
  getScheduledClasses,
  addScheduledClass,
  updateScheduledClass,
  deleteScheduledClass,
  getClassNotes,
  addClassNote,
  deleteClassNote,
  getPracticePapers,
  addPracticePaper,
  deletePracticePaper,
} from "../controllers/curriculumController";

const router = Router();

router.get("/competencies", getCompetencies);
router.get("/topics", getTopics);
router.post("/lesson-plan/generate", generateLessonPlan);

// Live Classes Scheduling
router.get("/classes", getScheduledClasses);
router.post("/classes", addScheduledClass);
router.put("/classes/:id", updateScheduledClass);
router.delete("/classes/:id", deleteScheduledClass);

// Class Notes & Materials
router.get("/notes", getClassNotes);
router.post("/notes", addClassNote);
router.delete("/notes/:id", deleteClassNote);

// Practice Papers & Worksheets
router.get("/practice-papers", getPracticePapers);
router.post("/practice-papers", addPracticePaper);
router.delete("/practice-papers/:id", deletePracticePaper);

export default router;
