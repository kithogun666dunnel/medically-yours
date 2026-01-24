import { Case } from "../../models/Case.model";

export interface InboundMessage {
  phone: string;
  text: string;
  messageId: string;
  timestamp: Date;
}

/**
 * Attaches an inbound WhatsApp message to an OPEN case,
 * or creates a new case if none exists.
 */
export async function handleInboundMessage(
  message: InboundMessage
) {
  const { phone } = message;

  // 1️⃣ Try to find existing OPEN case
  let openCase = await Case.findOne({
    patientPhone: phone,
    status: "OPEN",
  });

  // 2️⃣ If none exists, try creating a new OPEN case
  if (!openCase) {
    try {
      openCase = await Case.create({
        patientPhone: phone,
        status: "OPEN",
        openedAt: new Date(),
      });
    } catch (error: any) {
      // Race condition: another request created it
      if (error?.code === 11000) {
        openCase = await Case.findOne({
          patientPhone: phone,
          status: "OPEN",
        });
      } else {
        throw error;
      }
    }
  }

  // 3️⃣ Attach message (for now just return case)
  // Message persistence can be added later

  return openCase;
}
