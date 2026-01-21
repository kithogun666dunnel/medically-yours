import express from "express";
import {
  getCases,
  closeCase,
  updateCaseNotes,
  updateCaseOverride,
} from "../controllers/case.controller.js";

const router = express.Router();

router.get("/cases", getCases);
router.post("/cases/:id/close", closeCase);
router.patch("/cases/:id/notes", updateCaseNotes);
router.patch("/cases/:id/override", updateCaseOverride);

export default router;
