/* -------------------- WHATSAPP MESSAGE MODEL --------------------
   Infrastructure model used to guarantee idempotent
   processing of inbound WhatsApp messages.
---------------------------------------------------------------- */


import { Schema, model, Document } from "mongoose";

export interface IWhatsappMessage extends Document {
  messageSid: string;
  from: string;
  createdAt: Date;
  processedAt?: Date;
}

const WhatsappMessageSchema = new Schema<IWhatsappMessage>(
  {
    messageSid: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: false,
  }
);

// 🔒 Idempotency guarantee: one MessageSid only once
WhatsappMessageSchema.index(
  { messageSid: 1 },
  { unique: true }
);

export const WhatsappMessage = model<IWhatsappMessage>(
  "WhatsappMessage",
  WhatsappMessageSchema
);


/*

WhatsappMessage.model.ts ✅ (INFRASTRUCTURE)
✅ What this model represents

This model exists only for idempotency.

Each record represents:

one inbound WhatsApp message

uniquely identified by MessageSid

🧠 Why this model is critical

Without this:

Twilio retries → duplicate processing

duplicate cases

broken system

With this:

database enforces uniqueness

idempotency survives restarts

system is resilient

🔒 Important invariant
WhatsappMessageSchema.index(
  { messageSid: 1 },
  { unique: true }
);


This line alone:

protects the entire WhatsApp ingestion pipeline

*/