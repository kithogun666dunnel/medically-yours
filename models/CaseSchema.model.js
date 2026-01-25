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
