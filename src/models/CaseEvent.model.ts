/* -------------------- CASE EVENT MODEL --------------------
   Immutable audit log for all significant case lifecycle events.
   Events are append-only and never updated or deleted.
----------------------------------------------------------- */

import mongoose, { Schema, Document } from "mongoose";

export interface CaseEventDocument extends Document {
  caseId: mongoose.Types.ObjectId;
  type: "CASE_CREATED" | "CASE_CLOSED";
  actorType?: "doctor" | "system";
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

  actorType: {
    type: String,
    enum: ["doctor", "system"],
  },

  meta: {
    type: Schema.Types.Mixed,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const CaseEvent = mongoose.model<CaseEventDocument>(
  "CaseEvent",
  CaseEventSchema
);


/*
✅ What this model represents

This model is an immutable audit log.

Each record answers:

what happened?

to which case?

who did it?

when?

with what metadata?

🧠 Why this model exists

This enables:

auditability

debugging

compliance

future analytics

replay / reconstruction

Instead of:

Case.status = CLOSED


You get:

CASE_CLOSED by doctor at 10:42 with reason X

🔒 Important design decision
meta: Schema.Types.Mixed


This allows:

flexible metadata

future expansion

no schema churn for every new event

But:

structure is enforced at service layer, not model
*/