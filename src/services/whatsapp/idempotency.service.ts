/* -------------------- WHATSAPP IDEMPOTENCY SERVICE --------------------
   Guarantees exactly-once processing of inbound
   WhatsApp messages using MessageSid uniqueness.
-------------------------------------------------------------------- */

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
    if (error?.code === 11000) {
      return { isDuplicate: true };
    }
    throw error;
  }
}


/*

✅ What this service does

Ensures each WhatsApp message is processed once

Uses MessageSid as natural idempotency key

Stores inbound message metadata

Returns { isDuplicate }

🧠 Why this logic is CRITICAL

WhatsApp / Twilio behaviour:

retries on timeout

retries on 5xx

retries on network issues

Without this service:

duplicate cases

duplicate messages

broken audit

This service protects the entire system.

🔒 Design insight (important)

This line 👇

if (error?.code === 11000)


Means:

Mongo unique index violation

Which means message already seen

👉 Database is used as source of truth for idempotency
👉 No in-memory hacks
👉 Safe across restarts
*/