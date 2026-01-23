import { Schema, model, Document } from "mongoose";

export type CaseStatus = "OPEN" | "CLOSED";

export interface ICase extends Document {
  patientPhone: string;
  status: CaseStatus;
  openedAt: Date;
  closedAt?: Date;
  closedBy?: "doctor" | "system";
  closedReason?: string;
}

const CaseSchema = new Schema<ICase>(
  {
    patientPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      required: true,
    },
    openedAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
    },
    closedBy: {
      type: String,
      enum: ["doctor", "system"],
    },
    closedReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 🔒 Invariant: only ONE OPEN case per patient
CaseSchema.index(
  { patientPhone: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "OPEN" },
  }
);

export const Case = model<ICase>("Case", CaseSchema);
