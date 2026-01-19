import PatientCase from "../models/PatientCase.model.js";
import { SEVERITY } from "../constants/severity.js";

export const whatsappWebhook = async (req, res) => {
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
};
