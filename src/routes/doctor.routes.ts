  /* -------------------- DOCTOR ROUTES (LEGACY) --------------------
    Exposes APIs used by the existing doctor dashboard.
    These routes rely on legacy PatientCase models and
    are maintained for backward compatibility only.
  ---------------------------------------------------------------- */


  import express from "express";
  import {
    getDoctorDashboard,
    closePatientCase,
    getClosedCasesHistory,
  } from "../controllers/doctor.controller";

  const router = express.Router();

  router.get("/dashboard", getDoctorDashboard);
  router.patch("/cases/:id/close", closePatientCase);
  router.get("/cases/closed", getClosedCasesHistory);

  export default router;









  /*
  ✅ What this file is doing

  This file exposes doctor-facing APIs.

  Endpoints:

  GET /dashboard

  PATCH /cases/:id/close

  GET /cases/closed

  These are:

  legacy / transitional endpoints

  built on top of PatientCase model

  used by older dashboard UI

  🧠 Why this file still exists (important context)

  Tumhare system me do parallel worlds hain:

  1️⃣ Canonical world (new)

  Case

  CaseEvent

  WhatsApp-first

  Clean lifecycle

  New case.routes.ts

  2️⃣ Doctor dashboard world (legacy)

  PatientCase

  severity-based sorting

  traditional CRUD APIs

  doctor.routes.ts

  👉 Is file ko delete nahi kiya gaya because:

  dashboard abhi dependent hai

  migration incremental hai

  production break nahi karna

  🔒 Boundary rule

  Is file:

  ❌ new features add nahi honge

  ❌ new logic design nahi hoga

  ✅ sirf existing dashboard ko support karega

  Agar koi engineer yahan naya logic add kare:
  👉 architecture smell

  */