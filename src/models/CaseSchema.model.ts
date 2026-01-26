/* -------------------- LEGACY PATIENT CASE SCHEMA --------------------
   Maintained only for backward compatibility with
   the existing doctor dashboard.
   New logic must NOT depend on this model.
------------------------------------------------------------------ */

import mongoose from "mongoose";

const patientCaseSchema = new mongoose.Schema(
  {
    patientName: String,
    age: Number,
    complaint: String,

    severity: {
      type: Number,
      enum: [1, 2],
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },

    closedAt: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.PatientCase ||
  mongoose.model("PatientCase", patientCaseSchema);


  /*  
  ✅ What this model is

This is a legacy PatientCase schema, older variant.

It includes:

patientName

age

complaint

severity

CLOSED / OPEN status

🧠 Why this file still exists

Because:

older doctor dashboard depends on it

migration is incremental

deleting it would break UI

This file is not wrong, it’s just not future-facing.

🔒 Boundary rule

❌ Do not add new features here

❌ Do not use this in new services

✅ Keep only until dashboard migration is complete
  
  */