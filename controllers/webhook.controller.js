//->legacy file for whatsapp webhook controller
// --> new file for whatsapp webhook controller is /controllers/whatsapp/whatsappWebhook.controller.js

// import PatientCase from "../models/PatientCase.model.js";
import { SEVERITY } from "../constants/severity.js";
import { whatsappWebhookSchema } from "../validators/webhook.schema.js";

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
