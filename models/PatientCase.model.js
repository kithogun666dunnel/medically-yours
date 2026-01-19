import mongoose from "mongoose";

const patientCaseSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    age: Number,

    complaint: {
      type: String,
      required: true,
    },

    // 🔥 CORE FIELD
    severity: {
      type: Number,
      enum: [1, 2], // 1 = NORMAL, 2 = EMERGENCY
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

export default mongoose.model("PatientCase", patientCaseSchema);
