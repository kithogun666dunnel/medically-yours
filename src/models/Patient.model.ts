import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  whatsapp: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["NORMAL", "EMERGENCY"],
    default: "NORMAL",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;


/*
Patient.model.ts ❌ (DEPRECATED / EXPERIMENTAL)
✅ What this model represents

This appears to be an early experiment:

patient + symptoms

severity flag

WhatsApp-centric

🧠 Current status

Right now:

this model is not used in core flows

no services depend on it

safe to keep but not evolve

Think of it as:

“historical artifact”

🔒 Boundary rule

❌ Do not use in new code

❌ Do not expand

✅ Remove later when safe

*/