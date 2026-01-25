import mongoose, { Schema, Document } from "mongoose";

export interface CaseEventDocument extends Document {
  caseId: mongoose.Types.ObjectId;
  type: "CASE_CREATED" | "CASE_CLOSED";
  meta?: Record<string, any>;
  createdAt: Date;
}

const CaseEventSchema = new Schema<CaseEventDocument>({
  caseId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },

  type: {
    type: String,
    enum: ["CASE_CREATED", "CASE_CLOSED"],
    required: true,
  },

  meta: {
    type: Schema.Types.Mixed,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<CaseEventDocument>(
  "CaseEvent",
  CaseEventSchema
);
