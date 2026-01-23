import express from "express";

const router = express.Router();

import whatsappWebhookController from "../controllers/whatsapp/whatsappWebhook.controller.js";

// WhatsApp inbound webhook
router.post("/whatsapp", whatsappWebhookController);

export default router;
