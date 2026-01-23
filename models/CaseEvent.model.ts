import { Schema, model, Document, Types } from "mongoose";

export type CaseEventType = "CASE_OPENED" | "CASE_CLOSED";
export type ActorType = "doctor" | "system";

export interface ICaseEvent extends Document {
  caseId: Types.ObjectId;
  eventType: CaseEventType;
  actorType: ActorType;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const CaseEventSchema = new Schema<ICaseEvent>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    eventType: {
      type: String,
      enum: ["CASE_OPENED", "CASE_CLOSED"],
      required: true,
    },
    actorType: {
      type: String,
      enum: ["doctor", "system"],
      required: true,
    },
    metadata: {
      type: Object,
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

export const CaseEvent = model<ICaseEvent>(
  "CaseEvent",
  CaseEventSchema
);
