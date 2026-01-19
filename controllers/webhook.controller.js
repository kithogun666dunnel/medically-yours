import PatientCase from "../models/PatientCase.model.js";
import { SEVERITY } from "../constants/severity.js";
import { whatsappWebhookSchema } from "../validators/webhook.schema.js";

export const whatsappWebhook = async (req, res, next) => {
  try {
    const parsed = whatsappWebhookSchema.parse(req.body);

    const { from, message } = req.body;

    let severity = SEVERITY.NORMAL;

    // 🧠 VERY BASIC MVP LOGIC
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

    await PatientCase.create({
      patientName: from || "Unknown",
      complaint: message,
      severity,
    });

    res.status(200).json({
      status: "case_created",
      severity,
    });
  } catch (err) {
    next(err);
  }
};
