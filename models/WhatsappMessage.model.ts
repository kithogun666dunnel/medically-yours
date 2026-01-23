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
