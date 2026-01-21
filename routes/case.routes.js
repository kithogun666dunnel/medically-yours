import express from "express";
import { getCases, closeCase } from "../controllers/case.controller.js";

const router = express.Router();

router.get("/cases", getCases);
router.post("/cases/:id/close", closeCase);

export default router;
