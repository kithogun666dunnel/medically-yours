import { WhatsappMessage } from "../../models/WhatsappMessage.model";

export interface IdempotencyResult {
  isDuplicate: boolean;
}

/**
 * Registers an inbound WhatsApp message by MessageSid.
 * Ensures each message is processed exactly once.
 */
export async function registerInboundMessage(
  messageSid: string,
  from: string
): Promise<IdempotencyResult> {
  try {
    await WhatsappMessage.create({
      messageSid,
      from,
      createdAt: new Date(),
    });

    return { isDuplicate: false };
  } catch (error: any) {
    // Mongo duplicate key error
    if (error?.code === 11000) {
      return { isDuplicate: true };
    }

    throw error;
  }
}
