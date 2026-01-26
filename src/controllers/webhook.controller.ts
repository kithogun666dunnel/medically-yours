//->legacy file for whatsapp webhook controller
// --> new file for whatsapp webhook controller is /controllers/whatsapp/whatsappWebhook.controller.js
// import PatientCase from "../models/PatientCase.model.js";


import { SEVERITY } from "../constants/severity";
import { whatsappWebhookSchema } from "../validators/webhook.schema";

export const whatsappWebhook = async (req, res, next) => {
  try {
    const rawFrom = req.body.from || req.body.From;
    const rawMessage = req.body.message || req.body.Body;

    const { from, message } = whatsappWebhookSchema.parse({
      from: rawFrom,
      message: rawMessage,
    });
    let severity = SEVERITY.NORMAL;

    const emergencyKeywords = [
      "chest pain",
      "breath",
      "bleeding",
      "unconscious",
      "heart",
      "accident",
    ];

    const isEmergency = emergencyKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword),
    );

    if (isEmergency) {
      severity = SEVERITY.EMERGENCY;
    }

    // await PatientCase.create({
    //   patientName: from,
    //   complaint: message,
    //   severity,
    // });

    res.status(200).json({
      status: "ignored",
      reason: "legacy webhook disabled during Layer-6 migration",
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        status: "error",
        message: err.errors,
      });
    }
    next(err); // 👈 IMPORTANT (warna silent 500)
  }
};


/*
✅ What this file does

Currently:

Nothing meaningful

Returns a static “ignored” response

Old WhatsApp logic commented out

🧠 Why this file exists

This file exists because:

Earlier WhatsApp webhook lived here

During migration, it was frozen instead of deleted

Avoids breaking imports / routes accidentally

👉 This is a deliberate freeze, not dead code negligence.

🔒 Boundary rule

❌ Do not revive this file

❌ Do not add logic here

✅ Use it only as historical reference

All real WhatsApp logic now lives in:

controllers/whatsapp/whatsappWebhook.controller.ts

*/