/* -------------------- CASE ROUTES --------------------
   Exposes HTTP endpoints for case lifecycle actions.
   This file intentionally enables only a minimal subset
   of case operations to keep the system controlled.
---------------------------------------------------- */

import express from "express";
import { closeCaseController } from "../controllers/case.controller";

const router = express.Router();

// 🔓 Layer-6: ONLY case close is enabled
router.post("/cases/:id/close", closeCaseController);

// ❌ Still disabled (out of scope)
// router.get("/cases", getCases);
// router.patch("/cases/:id/notes", updateCaseNotes);
// router.patch("/cases/:id/override", updateCaseOverride);

export default router;


///--->> comment for myself in detail

/*  
✅ What this file is doing

Defines case lifecycle–related HTTP endpoints

Right now sirf ek hi capability expose karta hai:

POST /cases/:id/close

Ye endpoint:

kisi case ko close karta hai

actual logic controller + service me hota hai

route ka kaam sirf wire karna hai



🎯 Why this file exists

Is file ka purpose hai:

case lifecycle ko doctor dashboard se decouple karna

Clearly dikhana:

“Case system evolve ho raha hai, but abhi limited hai”

Comments me intentionally likha hai:

🔓 Layer-6: ONLY case close is enabled


👉 Ye comment future reader ko bolta hai:

“aur cheezein planned hain”

“abhi intentionally off hain”

“galti se enable mat kar dena”

🔒 Important boundary (very important to explain)

Is route file me:

❌ DB access nahi

❌ business rules nahi

❌ status validation nahi

Sirf:

HTTP → controller


Agar kal case close ka logic change hota hai:

routes unchanged rahenge

sirf controller/service change hoga
*/