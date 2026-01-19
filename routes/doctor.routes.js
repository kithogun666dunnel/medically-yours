import express from "express";
import {
  getDoctorDashboard,
  closePatientCase,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/dashboard", getDoctorDashboard);
router.patch("/cases/:id/close", closePatientCase);

export default router;
