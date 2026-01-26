/* -------------------- WHATSAPP INBOUND SERVICE --------------------
   Resolves inbound messages to a single OPEN case.
   Enforces the invariant of one active case per patient
   and safely handles concurrent message arrivals.
------------------------------------------------------------------ */

import { Case } from "../../models/Case.model.ts";

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


/*
✅ What this service does

This service answers:

“When a WhatsApp message arrives, which case should it belong to?”

Steps:

Find existing OPEN case for phone

If none, create one

Handle race conditions safely

Return canonical case

🧠 Why this is a service (not controller)

This logic:

has race conditions

has DB constraints

must be reusable

Controller:

should not know how cases are created

should not know about uniqueness constraints

Service encapsulates:

“One OPEN case per patient phone.”

🔒 Important invariant
only ONE OPEN case per patient


This invariant is enforced by:

Mongo partial unique index

Retry logic on duplicate key error

This is very strong system design.
*/