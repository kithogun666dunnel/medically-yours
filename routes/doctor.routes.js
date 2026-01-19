import express from "express";
import {
  getDoctorDashboard,
  closePatientCase,
  getClosedCasesHistory,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/dashboard", getDoctorDashboard);
router.patch("/cases/:id/close", closePatientCase);
router.get("/cases/closed", getClosedCasesHistory);

export default router;
