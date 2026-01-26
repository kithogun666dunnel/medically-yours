/* -------------------- LEGACY PATIENT CASE MODEL --------------------
   UI-facing model used by the existing doctor dashboard.
   Not suitable for canonical case lifecycle logic.
------------------------------------------------------------------ */


import mongoose from "mongoose";

const patientCaseSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: false,
    },

    age: Number,

    complaint: {
      type: String,
      required: false,
    },

    // 🔥 CORE FIELD
    severity: {
      type: Number,
      enum: [1, 2], // 1 = NORMAL, 2 = EMERGENCY
      required: false,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
    closedAt: {
      type: Date,
    },

    messages: [
      {
        text: String,
        messageId: String,
        timestamp: Date,
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);
export default mongoose.models.PatientCase ||
  mongoose.model("PatientCase", patientCaseSchema);


  /*

PatientCase.model.ts ❌ (LEGACY DASHBOARD)
✅ What this model represents

This is the actual model used by doctor.controller.ts.

It includes:

severity-based triage

message array

UI-focused fields

🧠 Why this model is separate from Case

Because:

UI needs severity sorting

messages are embedded

lifecycle rules are weaker

This model is view-model-ish, not domain-model.

🔒 Boundary rule

❌ New business logic must NOT depend on this

❌ WhatsApp services must NOT use this

✅ Only doctor dashboard uses it
  */