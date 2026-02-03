import { Schema, model, Document, Types } from "mongoose";

export type CaseActivityType =
  | "CASE_CREATED"
  | "CASE_CLOSED"
  | "MESSAGE_RECEIVED"
  | "SYSTEM_NOTE"
  | "DOCTOR_NOTE";

export interface CaseActivityDocument extends Document {
  caseId: Types.ObjectId;
  type: CaseActivityType;
  source: "whatsapp" | "doctor" | "system";
  payload?: Record<string, any>;
  createdAt: Date;
}

const CaseActivitySchema = new Schema<CaseActivityDocument>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      enum: ["whatsapp", "doctor", "system"],
      required: true,
    },

    payload: {
      type: Schema.Types.Mixed,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const CaseActivity = model<CaseActivityDocument>(
  "CaseActivity",
  CaseActivitySchema
);
