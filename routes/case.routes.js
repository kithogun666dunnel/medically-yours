import express from "express";
import { closeCase } from "../controllers/case.controller.js";

const router = express.Router();

// 🔓 Layer-6: ONLY case close is enabled
router.post("/cases/:id/close", closeCase);

// ❌ Still disabled (out of scope)
// router.get("/cases", getCases);
// router.patch("/cases/:id/notes", updateCaseNotes);
// router.patch("/cases/:id/override", updateCaseOverride);

export default router;
