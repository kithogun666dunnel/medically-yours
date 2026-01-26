/* -------------------- CASE MODEL (CANONICAL) --------------------
   Represents the authoritative lifecycle of a medical case.
   Enforces the invariant that a patient can have only one
   OPEN case at any point in time.
---------------------------------------------------------------- */


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


/*
✅ What this model represents

This is the canonical Case model.

It represents:

one medical case

owned by a single patient phone

with a clean lifecycle: OPEN → CLOSED

This model is:

WhatsApp-first

lifecycle-driven

future-proof

🧠 Why this model exists

This model replaces:

PatientCase

severity-driven dashboard logic

UI-specific assumptions

It is designed to be:

system-centric, not UI-centric

event-driven

safe under concurrency

🔒 MOST IMPORTANT PART (read this twice)
CaseSchema.index(
  { patientPhone: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "OPEN" },
  }
);

What this guarantees

❗ One and only one OPEN case per patient phone

At the database level.

This means:

two WhatsApp messages at same time ❌ no duplicate open cases

retry storms ❌ no duplication

services can rely on this invariant blindly

This is excellent backend design.

🧠 Why DB-level invariant (not service-only)

If this rule lived only in code:

race conditions could bypass it

horizontal scaling would break it

By putting it in Mongo:

invariant is global

survives restarts

survives parallel workers
*/