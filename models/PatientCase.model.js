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

export default mongoose.model("PatientCase", patientCaseSchema);
