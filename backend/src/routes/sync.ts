import { Router } from "express";
import { getOfflinePack, getSyncStatus } from "../controllers/syncController";

const router = Router();

router.get("/offline-pack", getOfflinePack);
router.get("/status", getSyncStatus);

export default router;
