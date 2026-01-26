/* -------------------- WEBHOOK ROUTES --------------------
   Entry point for external systems (e.g., Twilio).
   These routes are designed to be resilient and
   always acknowledge inbound requests.
-------------------------------------------------------- */


import express from "express";

const router = express.Router();

import whatsappWebhookController from "../controllers/whatsapp/whatsappWebhook.controller";

// WhatsApp inbound webhook
router.post("/whatsapp", whatsappWebhookController);

export default router;


/*
✅ What this file is doing

Defines external system entry point

Receives incoming WhatsApp messages (Twilio webhook)

Routes them to WhatsApp-specific controller

This is:

non-human traffic

machine → machine

completely separate from doctor UI APIs

🧠 Why this is isolated

WhatsApp inbound:

has different failure semantics

must always return 200 OK

must be idempotent

must not break on errors

So it lives in:

/routes/webhook


Not mixed with /api/*.

🔒 Boundary rule

❌ No auth middleware

❌ No user context

❌ No UI assumptions

Just:

Twilio → Controller → Services
*/